import { NextResponse } from 'next/server'
import { getAdminDatabase, getAdminStorageBucket } from '@/lib/firebase/admin'

const ADMIN_TOKEN = process.env.ADMIN_API_TOKEN

const isAuthorized = (request: Request) => {
  const headerToken = request.headers.get('x-admin-token')
  const bearer = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  const token = headerToken || bearer
  return Boolean(ADMIN_TOKEN && token && token === ADMIN_TOKEN)
}

const uploadImages = async (files: File[]) => {
  const bucket = getAdminStorageBucket()
  const uploads = files.map(async (file) => {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`
    const fileRef = bucket.file(`settings/${uniqueName}`)
    await fileRef.save(buffer, {
      contentType: file.type || 'application/octet-stream',
    })
    const [url] = await fileRef.getSignedUrl({
      action: 'read',
      expires: '03-01-2030',
    })
    return url
  })
  return Promise.all(uploads)
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const mode = String(formData.get('mode') || 'update')
    const paramTag = String(formData.get('paramTag') || '')
    const id = String(formData.get('id') || '')
    const title = String(formData.get('title') || '')
    const description = String(formData.get('description') || '')
    const tag = String(formData.get('tag') || paramTag)
    const statusValue = String(formData.get('status') || 'false')
    const status = statusValue === 'true'
    const existingImagesRaw = String(formData.get('existingImages') || '[]')
    const existingImages = JSON.parse(existingImagesRaw)

    if (mode === 'delete') {
      if (!paramTag || !id) {
        return NextResponse.json({ error: 'Missing tag or id.' }, { status: 400 })
      }
      const database = getAdminDatabase()
      await database.ref(`Settings/${paramTag}/${id}`).set(null)
      return NextResponse.json({ id })
    }

    if (!paramTag || !title || !description) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    const files = formData.getAll('images').filter((item) => item instanceof File) as File[]
    const uploadedImages = files.length ? await uploadImages(files) : []
    const images = uploadedImages.length ? uploadedImages : existingImages

    const database = getAdminDatabase()

    if (mode === 'create') {
      const countRef = database.ref(`Settings/count/${paramTag}`)
      const countSnapshot = await countRef.get()
      const countValue = Number(countSnapshot.val() || 0)
      const newId = countValue + 1

      const payload = {
        title,
        description,
        status,
        tag,
        images,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await database.ref(`Settings/${paramTag}/${newId}`).set(payload)
      await countRef.set(newId)

      return NextResponse.json({ id: String(newId) })
    }

    if (!id) {
      return NextResponse.json({ error: 'Missing id for update.' }, { status: 400 })
    }

    const updatePayload: Record<string, any> = {
      title,
      description,
      status,
      tag,
      updatedAt: new Date().toISOString(),
    }

    if (images && images.length) {
      updatePayload.images = images
    }

    await database.ref(`Settings/${paramTag}/${id}`).update(updatePayload)

    return NextResponse.json({ id })
  } catch (error: any) {
    console.error('Admin content save error:', error)
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 })
  }
}
