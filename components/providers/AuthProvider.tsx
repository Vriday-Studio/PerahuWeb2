'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { logOut } from '@/lib/firebase/auth'

type AuthUser = {
  id?: string | number
  Nama?: string
  Email?: string
  Role?: string
  Gender?: string
  Tanggal_Lahir?: string
  Hp?: string
  terms?: boolean
  avatar?: string
  expiredAt?: number
  [key: string]: any
} | null

type LoginPayload = {
  user: AuthUser
  redirect?: string
}

type AuthContextValue = {
  user: AuthUser
  isReady: boolean
  setUser: (user: AuthUser) => void
  loginUser: (data: LoginPayload) => void
  logoutUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const getNextMidnight = () => {
  const currentDate = new Date()
  const midnight = new Date(
    currentDate.getUTCFullYear(),
    currentDate.getUTCMonth(),
    currentDate.getUTCDate() + 1,
    0,
    0,
    0
  )
  midnight.setUTCHours(midnight.getUTCHours())
  return midnight.getTime()
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser>(null)
  const [isReady, setIsReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      if (parsedUser.expiredAt && parsedUser.expiredAt < Date.now()) {
        localStorage.removeItem('user')
        setUser(null)
      } else {
        setUser(parsedUser)
      }
    }
    setIsReady(true)
  }, [])

  const loginUser = useCallback(
    (data: LoginPayload) => {
      setUser(data.user)
      localStorage.setItem(
        'user',
        JSON.stringify({
          ...data.user,
          expiredAt: getNextMidnight(),
        })
      )
      if (data.redirect) {
        router.push(data.redirect)
      }
    },
    [router]
  )

  const logoutUser = useCallback(async () => {
    setUser(null)
    localStorage.removeItem('user')
    await logOut()
    router.push('/sign-in')
  }, [router])

  const value = useMemo(
    () => ({ user, isReady, setUser, loginUser, logoutUser }),
    [user, isReady, loginUser, logoutUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
