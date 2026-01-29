'use client'

import Button from '@/components/Button'
import { Container } from '@/components/Container'
import Loading from '@/components/Loading'
import { useAuth } from '@/components/providers/AuthProvider'
import { database } from '@/app/firebase'
import { ref, set, get } from 'firebase/database'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useMemo, useState } from 'react'

type StatusState = { type: 'success' | 'error'; message: string } | null

const BOAT_OPTIONS = [
  { value: 1, label: 'Perahu Putih' },
  { value: 2, label: 'Perahu Kuning' },
]

const BoatPage = () => {
  const { user, isReady } = useAuth()
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('')
  const [boatType, setBoatType] = useState<number>(1)
  const [status, setStatus] = useState<StatusState>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const userId = useMemo(() => {
    const idValue = (user as any)?.id ?? (user as any)?.userID
    return typeof idValue === 'string' || typeof idValue === 'number' ? idValue : null
  }, [user])

  useEffect(() => {
    if (isReady && !user) {
      router.replace('/sign-in')
    }
  }, [isReady, user, router])

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId || !user) return
      try {
        const snapshot = await get(ref(database, `Users/${userId}`))
        if (snapshot.exists()) {
          const data = snapshot.val()
          const rawName = data?.Nama
          const rawAvatar = data?.avatar

          if (typeof rawName === 'string') {
            const firstName = rawName.split(' ').filter(Boolean)[0] ?? ''
            setName(firstName)
          }

          if (typeof rawAvatar === 'string') {
            setAvatar(rawAvatar)
          } else if (Array.isArray(rawAvatar)) {
            setAvatar(rawAvatar.join(','))
          } else if (rawAvatar !== undefined && rawAvatar !== null) {
            setAvatar(String(rawAvatar))
          }
        }
      } catch (error) {
        console.error('Gagal mengambil nama pengguna:', error)
      }
    }

    fetchUserData()
  }, [userId, user])

  if (!isReady || !user) {
    return <Loading />
  }

  const checkBadwords = async (text: string): Promise<boolean> => {
    try {
      const snapshot = await get(ref(database, 'count/badwords'))
      if (snapshot.exists()) {
        const badwordsData = snapshot.val()
        const badwordsList = badwordsData.split('_').map((word: string) => word.trim().toLowerCase())
        const textLower = text.toLowerCase()
        return badwordsList.some((badword: string) => textLower.includes(badword))
      }
      return false
    } catch (error) {
      console.error('Gagal mengecek badwords:', error)
      return false
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus(null)

    if (!userId) {
      setStatus({
        type: 'error',
        message: 'ID pengguna tidak ditemukan. Silakan login ulang.',
      })
      return
    }

    const trimmedName = name.trim()
    const trimmedMessage = message.trim()

    if (!trimmedName) {
      setStatus({
        type: 'error',
        message: 'Nama tidak boleh kosong.',
      })
      return
    }

    if (!trimmedMessage) {
      setStatus({
        type: 'error',
        message: 'Pesan tidak boleh kosong.',
      })
      return
    }

    setIsSubmitting(true)
    try {
      const nameHasBadword = await checkBadwords(trimmedName)
      const messageHasBadword = await checkBadwords(trimmedMessage)

      if (nameHasBadword || messageHasBadword) {
        setStatus({
          type: 'error',
          message: 'Maaf anda tak bisa mengirim pesan tersebut.',
        })
        setIsSubmitting(false)
        return
      }

      await set(ref(database, `count/perahu/Player/${userId}`), {
        id: userId,
        Nama: trimmedName,
        avatar: avatar,
        message: trimmedMessage,
        jenisperahu: Number(boatType),
      })
      setStatus({
        type: 'success',
        message: 'Pesan sudah terkirim! Silahkan lihat pesan keluar di layar!',
      })
    } catch (error) {
      console.error('Gagal mengirim data perahu:', error)
      setStatus({
        type: 'error',
        message: 'Gagal mengirim perintah. Silakan coba lagi.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Container>
      <div className="px-5 py-10 space-y-6">
        <div className="space-y-2">
          <p className="text-sm text-gray-200 uppercase tracking-wide">Perahu</p>
          <h1 className="text-3xl font-semibold text-primary-brass">Naik Perahu</h1>
          <p className="text-sm text-white/80">
            Ayo berkeliling dengan naik perahu! Tulis pesan kamu untuk ditampilkan!
          </p>
        </div>

        <div className="bg-gray-black/60 border border-primary-brass rounded-2xl p-5 space-y-5">
          <div className="flex justify-between items-center text-sm text-white/80">
            <span>ID Pengguna</span>
            <span className="font-semibold text-primary-brass">{userId ?? '-'}</span>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm text-white/80" htmlFor="boat-name">
                Nama pemain
              </label>
              <input
                id="boat-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Masukkan nama pemain"
                className="w-full rounded-xl border border-primary-brass bg-primary-dark/60 text-white p-3 outline-none focus:ring-2 focus:ring-primary-orange"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/80" htmlFor="boat-message">
                Pesan untuk perahu
              </label>
              <div className="relative">
                <textarea
                  id="boat-message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value.slice(0, 80))}
                  maxLength={80}
                  placeholder="Tulis pesan yang akan dikirim ke pemain..."
                  className="w-full rounded-xl border border-primary-brass bg-primary-dark/60 text-white p-3 outline-none focus:ring-2 focus:ring-primary-orange min-h-[100px]"
                />
                <div className="text-xs text-white/60 text-right mt-1">
                  {message.length}/80
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/80" htmlFor="boat-type">
                Jenis perahu
              </label>
              <select
                id="boat-type"
                value={boatType}
                onChange={(event) => setBoatType(Number(event.target.value))}
                className="w-full rounded-xl border border-primary-brass bg-primary-dark/60 text-white p-3 outline-none focus:ring-2 focus:ring-primary-orange"
              >
                {BOAT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <Button
              type="submit"
              text="Naik Perahu!"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            />
          </form>

          {status && (
            <div
              className={`rounded-xl px-3 py-2 text-sm ${
                status.type === 'success'
                  ? 'bg-green-900/50 text-green-200 border border-green-700'
                  : 'bg-red-900/50 text-red-200 border border-red-700'
              }`}
            >
              {status.message}
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}

export default BoatPage
