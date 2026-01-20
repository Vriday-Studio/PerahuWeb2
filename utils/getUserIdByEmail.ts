import { database } from '@/app/firebase'
import { ref, query, orderByChild, equalTo, get } from 'firebase/database'
type EmailInput =
  | string
  | { Email?: string }
  | { user?: { email?: string } }
  | { email?: string }
  | null

export const getUserIdByEmail = async (input: EmailInput) => {
  const email =
    typeof input === 'string'
      ? input
      : (input as any)?.Email || (input as any)?.email || (input as any)?.user?.email || null

  if (!email) return null

  const usersRef = ref(database, 'Users')
  const emailQuery = query(usersRef, orderByChild('Email'), equalTo(email))
  const snapshot = await get(emailQuery)

  if (snapshot.exists()) {
    return Object.keys(snapshot.val())[0]
  }
  return null
}

export const getUserIdByEmailNoSesssion = async (data: any) => {
  const usersRef = ref(database, 'Users')
  const emailQuery = query(usersRef, orderByChild('Email'), equalTo(data))
  const snapshot = await get(emailQuery)

  if (snapshot.exists()) {
    return Object.keys(snapshot.val())[0]
  } else {
    return null
  }
}
