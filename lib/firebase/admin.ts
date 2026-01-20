import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getDatabase } from 'firebase-admin/database'
import { getStorage } from 'firebase-admin/storage'

const getServiceAccount = () => {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Missing Firebase Admin credentials.')
  }

  return {
    projectId,
    clientEmail,
    privateKey,
  }
}

export const getAdminApp = () => {
  if (getApps().length) return getApps()[0]

  const databaseURL = process.env.FIREBASE_ADMIN_DATABASE_URL
  const storageBucket = process.env.FIREBASE_ADMIN_STORAGE_BUCKET

  if (!databaseURL || !storageBucket) {
    throw new Error('Missing Firebase Admin databaseURL or storageBucket.')
  }

  return initializeApp({
    credential: cert(getServiceAccount()),
    databaseURL,
    storageBucket,
  })
}

export const getAdminDatabase = () => getDatabase(getAdminApp())

export const getAdminStorageBucket = () => getStorage(getAdminApp()).bucket()
