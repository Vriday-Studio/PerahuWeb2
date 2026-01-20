'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { setAdminToken } from '@/lib/adminClient'

export default function AdminTokenPage() {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSaved(false)
  }, [])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!token) return
    setAdminToken(token)
    setSaved(true)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white shadow-lg border border-slate-200 p-6 space-y-4"
      >
        <h1 className="text-xl font-semibold text-slate-900">Admin Access</h1>
        <p className="text-sm text-slate-600">
          Enter the admin token to manage content. The token is stored locally in this browser.
        </p>
        <input
          type="password"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:ring-2 focus:ring-slate-200 focus:outline-none"
          placeholder="Paste admin token"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-slate-900 px-4 py-3 text-white font-medium hover:bg-slate-800"
        >
          Save & Continue
        </button>
        {saved && <p className="text-sm text-green-600">Token saved. Redirecting...</p>}
      </form>
    </div>
  )
}
