import { NextResponse } from 'next/server'
import { getAdminDatabase, getAdminStorageBucket } from '@/lib/firebase/admin'

const ADMIN_TOKEN = process.env.ADMIN_API_TOKEN

const isAuthorized = (request: Request) => {
  const headerToken = request.headers.get('x-admin-token')
  const bearer = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  const token = headerToken || bearer
  return Boolean(ADMIN_TOKEN && token && token === ADMIN_TOKEN)
}

const uploadImage = async (file: File) => {
  const bucket = getAdminStorageBucket()
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`
  const fileRef = bucket.file(`artworks/${uniqueName}`)
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
    const mode = String(formData.get('mode') || 'update')
    const id = String(formData.get('id') || '')
    const title = String(formData.get('title') || '')
    const description = String(formData.get('description') || '')
    const statusValue = String(formData.get('status') || 'false')
    const status = statusValue === 'true'
    const area = String(formData.get('area') || '')
    const material = String(formData.get('material') || '')
    const year = String(formData.get('year') || '')
    const media = String(formData.get('media') || '')
    const size = String(formData.get('size') || '')
    const startAtIndex = String(formData.get('startAtIndex') || '')
    const endAtIndex = String(formData.get('endAtIndex') || '')
    const existingImage = String(formData.get('existingImage') || '')

    const database = getAdminDatabase()

    if (mode === 'delete') {
      if (!id) {
        return NextResponse.json({ error: 'Missing id.' }, { status: 400 })
      }
      await database.ref(`Artworks/${id}`).set(null)
      return NextResponse.json({ id })
    }

    if (!title || !description || !startAtIndex || !endAtIndex) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    const file = formData.get('image')
    let imageUrl = existingImage || ''
    if (file instanceof File && file.size > 0) {
      imageUrl = await uploadImage(file)
    }

    const targetIndex = Array.from(
      { length: Number(endAtIndex) - Number(startAtIndex) + 1 },
      (_, i) => i + Number(startAtIndex)
    )

    const payload = {
      title,
      description,
      status,
      area,
      material,
      year,
      media,
      size,
      startAtIndex,
      endAtIndex,
      targetIndex,
      image: imageUrl,
      updatedAt: new Date().toISOString(),
    }

    if (mode === 'create') {
      const countRef = database.ref('count/Artworks')
      const countSnapshot = await countRef.get()
      const countValue = Number(countSnapshot.val() || 0)
      const newId = countValue + 1

      const createPayload = {
        ...payload,
        id: newId,
        createdAt: new Date().toISOString(),
      }

      await database.ref(`Artworks/${newId}`).set(createPayload)
      await countRef.set(newId)
      return NextResponse.json({ id: String(newId) })
    }

    if (!id) {
      return NextResponse.json({ error: 'Missing id for update.' }, { status: 400 })
    }

    const previousSnapshot = await database.ref(`Artworks/${id}`).get()
    const previous = previousSnapshot.val() || {}

    await database.ref(`Artworks/${id}`).set({
      ...previous,
      ...payload,
      users: previous.users || {},
      usersCount: previous.usersCount || 0,
      quiz: previous.quiz || {},
    })

    return NextResponse.json({ id })
  } catch (error: any) {
    console.error('Admin artwork save error:', error)
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 })
  }
}
