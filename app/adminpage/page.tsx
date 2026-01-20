"use client"

import Link from "next/link"
import { useState, type FormEvent } from "react"
import { get, ref, set } from "firebase/database"

import { database } from "@/app/firebase"
import Button from "@/components/Button"
import { Container } from "@/components/Container"
import { getSelectedUserPoints } from "@/lib/firebase/users"

type UserProfile = {
  Nama?: string
  Email?: string
  skor?: number | string
  points?: number | string
  [key: string]: any
}

const AdminPage = () => {
  const [userId, setUserId] = useState("")
  const [userData, setUserData] = useState<UserProfile | null>(null)
  const [score, setScore] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFixing, setIsFixing] = useState(false)
  const [fixResult, setFixResult] = useState<string | null>(null)

  const handleFetchUser = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    const trimmedId = userId.trim()

    if (!trimmedId) {
      setError("Masukkan User ID terlebih dahulu.")
      return
    }

    setIsLoading(true)
    setError(null)
    setUserData(null)
    setScore(null)

    try {
      const userRef = ref(database, `Users/${trimmedId}`)
      const [userSnapshot, totalPoints] = await Promise.all([
        get(userRef),
        getSelectedUserPoints(trimmedId, false),
      ])

      if (!userSnapshot.exists()) {
        setError("User tidak ditemukan.")
        return
      }

      const userValue = userSnapshot.val() as UserProfile
      setUserData(userValue)

      if (typeof totalPoints === "number") {
        setScore(totalPoints)
      } else {
        const fallback = Number(userValue?.skor ?? userValue?.points ?? 0)
        setScore(Number.isFinite(fallback) ? fallback : 0)
      }
    } catch (err) {
      console.error("Error fetching user data", err)
      setError("Gagal mengambil data pengguna. Coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setUserId("")
    setUserData(null)
    setScore(null)
    setError(null)
    setFixResult(null)
  }

  const handleFixUndefinedUser = async () => {
    setIsFixing(true)
    setFixResult(null)
    setError(null)

    try {
      const usersRef = ref(database, "Users")
      const snapshot = await get(usersRef)
      if (!snapshot.exists()) {
        setFixResult("Data Users kosong.")
        return
      }

      const users = snapshot.val() as Record<string, any>
      const undefinedUser = users["undefined"]
      if (!undefinedUser) {
        setFixResult('Tidak ditemukan user dengan ID "undefined".')
        return
      }

      const numericKeys = Object.keys(users)
        .map((key) => Number(key))
        .filter((val) => Number.isFinite(val))
      const nextId = (numericKeys.length ? Math.max(...numericKeys) + 1 : 1).toString()

      await set(ref(database, `Users/${nextId}`), undefinedUser)
      await set(ref(database, "Users/undefined"), null)
      await set(ref(database, "isPlayerCount"), (Number(nextId) + 1).toString())

      setFixResult(`User "undefined" dipindah ke ID ${nextId}.`)
    } catch (err) {
      console.error("Error fixing undefined user", err)
      setError("Gagal memperbaiki user undefined. Coba lagi.")
    } finally {
      setIsFixing(false)
    }
  }

  return (
    <Container>
      <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-widest text-primary-orange">Admin</p>
          <h1 className="text-3xl font-semibold">User Lookup</h1>
          <p className="text-sm text-gray-200">
            Masukkan user ID sesuai path di Firebase Realtime Database (Users/{"{userId}"}).
          </p>
        </div>

        <form onSubmit={handleFetchUser} className="space-y-4">
          <label className="block text-sm font-medium">
            User ID
            <input
              type="text"
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              placeholder="Contoh: 123"
              className="mt-2 w-full rounded-xl border border-primary-orange/50 bg-white px-4 py-3 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-orange"
            />
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="sm:w-2/3">
              <Button text={isLoading ? "Fetching..." : "Get User Data"} type="submit" disabled={isLoading} isLoading={isLoading} />
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="sm:w-1/3 h-12 rounded-2xl border border-gray-700 bg-gray-900/60 text-white hover:border-primary-orange hover:text-primary-orange active:translate-y-1 duration-75"
            >
              Reset
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleFixUndefinedUser}
              disabled={isFixing}
              className="h-12 rounded-2xl border border-primary-orange/60 bg-primary-orange/10 text-primary-orange hover:bg-primary-orange/20 active:translate-y-1 duration-75 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isFixing ? "Memperbaiki..." : 'Perbaiki ID "undefined"'}
            </button>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {fixResult && <p className="text-sm text-green-400">{fixResult}</p>}
        </form>

        {userData && (
          <div className="rounded-2xl border border-primary-orange/40 bg-gray-900/40 p-4 space-y-4 shadow-[0_6px_18px_rgba(0,0,0,0.35)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-gray-300">Nama</p>
                <p className="text-lg font-semibold">{userData?.Nama ?? "-"}</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full border border-primary-orange/60 bg-primary-orange/10 text-primary-orange">
                ID: {userId.trim()}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-300">Email</p>
                <p className="font-medium break-words">{userData?.Email ?? "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-300">Skor</p>
                <p className="font-medium">{score ?? 0}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-300">Data lengkap</p>
              <pre className="text-xs bg-black/40 border border-gray-700 rounded-xl p-3 overflow-auto max-h-64 whitespace-pre-wrap break-words">
                {JSON.stringify(userData, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <div className="text-sm text-gray-300 space-y-1">
          <p>Skor dihitung menggunakan total points (quiz + profile) yang tersimpan di Firebase.</p>
          <p>
            <Link href="/" className="text-primary-orange underline underline-offset-4">Kembali ke beranda</Link>
          </p>
        </div>
      </div>
    </Container>
  )
}

export default AdminPage
