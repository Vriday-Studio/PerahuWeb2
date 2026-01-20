'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'

const StartPage = () => {
  const router = useRouter()
  const { user, isReady } = useAuth()

  useEffect(() => {
    const hasCompletedTutorial =
      typeof window !== 'undefined' ? sessionStorage.getItem('hasCompletedTutorial') : null
    if (!hasCompletedTutorial) {
      router.push('/')
      return
    }
    if (!user) {
      router.push('/sign-in')
    }
  }, [user, router])

  if (!isReady) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-dark text-white px-6 text-center">
      <div>
        <h1 className="text-2xl font-bold mb-2">Start AR</h1>
        <p className="text-sm text-white/80">
          Halaman AR belum dipindahkan ke versi ini. Beri tahu saya jika ingin menyalin MindAR
          viewer dari WebIKNew.
        </p>
      </div>
    </div>
  )
}

export default StartPage
