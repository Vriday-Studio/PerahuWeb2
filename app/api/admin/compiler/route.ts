import { NextResponse } from 'next/server'
import { getAdminDatabase, getAdminStorageBucket } from '@/lib/firebase/admin'

const ADMIN_TOKEN = process.env.ADMIN_API_TOKEN

const isAuthorized = (request: Request) => {
  const headerToken = request.headers.get('x-admin-token')
  const bearer = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  const token = headerToken || bearer
  return Boolean(ADMIN_TOKEN && token && token === ADMIN_TOKEN)
}

const uploadFile = async (path: string, file: File) => {
  const bucket = getAdminStorageBucket()
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`
  const fileRef = bucket.file(`${path}/${uniqueName}`)
  await fileRef.save(buffer, {
    contentType: file.type || 'application/octet-stream',
  })
  const [url] = await fileRef.getSignedUrl({
    action: 'read',
    expires: '03-01-2030',
  })
  return url
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const mode = String(formData.get('mode') || '')
    const database = getAdminDatabase()

    if (mode === 'reset') {
      await database.ref('CompiledImages').set(null)
      await database.ref('count/CompiledImages').set(0)
      return NextResponse.json({ ok: true })
    }

    if (mode === 'upload-target') {
      const targetFile = formData.get('target')
      if (!(targetFile instanceof File)) {
        return NextResponse.json({ error: 'Missing target file.' }, { status: 400 })
      }
      const url = await uploadFile('target', targetFile)
      await database.ref('targetUrl').set(url)
      return NextResponse.json({ url })
    }

    if (mode === 'upload-images') {
      const files = formData.getAll('images').filter((item) => item instanceof File) as File[]
      if (!files.length) {
        return NextResponse.json({ error: 'No images provided.' }, { status: 400 })
      }

      const countRef = database.ref('count/CompiledImages')
      const countSnapshot = await countRef.get()
      let countValue = Number(countSnapshot.val() || 0)

      for (const file of files) {
        const imageUrl = await uploadFile('compiledimages', file)
        await database.ref(`CompiledImages/${countValue}`).set({
          title: file.name,
          image: imageUrl,
          createdAt: new Date().toISOString(),
        })
        countValue += 1
      }

      await countRef.set(countValue)
      return NextResponse.json({ count: countValue })
    }

    return NextResponse.json({ error: 'Invalid mode.' }, { status: 400 })
  } catch (error: any) {
    console.error('Admin compiler error:', error)
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 })
  }
}
