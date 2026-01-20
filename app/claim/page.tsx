'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import BackIcon from '@/components/BackIcon'
import LoadingScreen from '@/components/LoadingScreen'
import { useAuth } from '@/components/providers/AuthProvider'
import { getSelectedUserPoints } from '@/lib/firebase/users'
import { getMinimalPointQuiz } from '@/lib/firebase/quiz'
import { checkRedeemCodeById, createRedeemCode, getRedeemCodeByUser } from '@/lib/firebase/redeemCode'

type MinimalPoint = {
  regular: number
  exclusive: number
}

const ClaimPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [userPoint, setUserPoint] = useState(0)
  const [minimalPoint, setMinimalPoint] = useState<MinimalPoint>({ regular: 0, exclusive: 0 })
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [userRedeemCode, setUserRedeemCode] = useState('')
  const [userRedeemStatus, setUserRedeemStatus] = useState(false)
  const [userRedeemType, setUserRedeemType] = useState('')

  const { user } = useAuth()

  useEffect(() => {
    if (!user?.id) return
    const fetchData = async () => {
      try {
        const [point, minimal, userRedeem] = await Promise.all([
          getSelectedUserPoints(String(user.id), false),
          getMinimalPointQuiz(),
          getRedeemCodeByUser(String(user.id)),
        ])

        const redeemStatus = userRedeem ? await checkRedeemCodeById(userRedeem) : null

        setUserPoint(Number(point || 0))
        setMinimalPoint(minimal || { regular: 0, exclusive: 0 })
        setUserRedeemStatus(Boolean(redeemStatus && redeemStatus.status))
        setUserRedeemType(redeemStatus?.type || '')
        setUserRedeemCode(userRedeem || '')
        setIsLoading(false)
      } catch (error) {
        console.error(error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user])

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option)
  }

const handleCreateRedeem = async (isFree: boolean) => {
  if (!user?.id) return // penting: id wajib ada

  try {
    const merchType = isFree ? 'free' : selectedOption
    if (!merchType) return

    const res = await createRedeemCode({ id: String(user.id) }, merchType)
    setUserRedeemCode(res)
    setUserPoint(0)
  } catch (error) {
    console.error(error)
  }
}


  if (isLoading) {
    return <LoadingScreen />
  }

  const isFree = minimalPoint.regular === 0 && minimalPoint.exclusive === 0

  return (
    <div className="h-screen flex flex-col items-center gap-10 relative z-20 bg-primary-dark">
      <BackIcon className="absolute left-2 top-2 z-10" iconColor="white" />
      <div className="relative flex flex-col justify-center items-center gap-1 px-5 w-full bg-primary-orange/80 h-1/5">
        <h1 className="text-xl font-bold text-white">Penukaran Poin</h1>
        {!userRedeemCode && (
          <div className="bg-cream text-primary-brass rounded-2xl py-1 px-10 mt-2 font-bold pb-2">
            {userPoint}
          </div>
        )}
        <Image src="/images/bg-auth.png" alt="bg-auth" fill sizes="100vw" className="object-cover opacity-40" />
      </div>

      {isFree && !userRedeemCode && (
        <div className="flex flex-col gap-10 justify-center items-center">
          <div className="space-y-8 px-20">
            <p className="text-lg font-bold text-center text-white">
              Apakah kamu yakin ingin menukarkan poin dengan merchandise kami?
            </p>
          </div>

          <button
            onClick={() => handleCreateRedeem(true)}
            className="bg-primary-orange text-white rounded-full px-12 py-3 shadow-[0_6px_18px_rgba(0,0,0,0.2)] disabled:bg-slate-600"
          >
            Tukarkan Poin
          </button>
        </div>
      )}

      {!isFree && userPoint >= minimalPoint.regular && !userRedeemCode && (
        <div className="space-y-4 flex flex-col items-center w-full">
          {minimalPoint.regular > 0 && (
            <button
              type="button"
              disabled={userPoint < minimalPoint.regular}
              className={`w-3/4 space-y-2 p-4 rounded-2xl text-white shadow-[0_6px_18px_rgba(0,0,0,0.2)] ${
                selectedOption === 'regular' ? 'bg-primary-orange' : 'bg-primary-orange/70'
              } disabled:bg-slate-700`}
              onClick={() => handleOptionSelect('regular')}
            >
              <p className="border-b border-white/30 pb-2">Merchandise Reguler</p>
              <p>{minimalPoint.regular} Point</p>
            </button>
          )}
          {minimalPoint.exclusive > 0 && (
            <button
              type="button"
              disabled={userPoint < minimalPoint.exclusive}
              className={`w-3/4 space-y-2 p-4 rounded-2xl text-white shadow-[0_6px_18px_rgba(0,0,0,0.2)] ${
                selectedOption === 'exclusive' ? 'bg-primary-orange' : 'bg-primary-orange/70'
              } disabled:bg-slate-700`}
              onClick={() => handleOptionSelect('exclusive')}
            >
              <p className="border-b border-white/30 pb-2">Merchandise Exclusive</p>
              <p>{minimalPoint.exclusive} Point</p>
            </button>
          )}

          <button
            disabled={!selectedOption}
            onClick={() => handleCreateRedeem(false)}
            className="bg-primary-orange text-white rounded-full px-12 py-3 shadow-[0_6px_18px_rgba(0,0,0,0.2)] disabled:bg-slate-600"
          >
            Tukarkan Poin
          </button>
        </div>
      )}

      {!isFree && userPoint < minimalPoint.regular && !userRedeemCode && (
        <div className="flex flex-col gap-10 justify-center items-center">
          <div className="space-y-8 px-20">
            <p className="text-lg font-bold text-center text-white">
              Kumpulkan koleksi lainnya untuk melihat informasi dan mainkan kuisnya untuk mendapatkan merchandise ekslusif Galeri Indonesia Kaya.
            </p>
          </div>

          <Link
            href="/"
            className="bg-primary-orange text-white rounded-full px-12 py-3 shadow-[0_6px_18px_rgba(0,0,0,0.2)]"
          >
            OK, Mengerti
          </Link>
        </div>
      )}

      {userRedeemCode && userRedeemStatus && (
        <div className="flex flex-col gap-10 justify-center items-center">
          <div className="space-y-8 px-20">
            <p className="text-lg font-bold text-center text-white">Hadiah merchandise sudah diklaim.</p>
          </div>

          <Link
            href="/"
            className="bg-primary-orange text-white rounded-full px-12 py-3 shadow-[0_6px_18px_rgba(0,0,0,0.2)]"
          >
            OK, Mengerti
          </Link>
        </div>
      )}

      {userRedeemCode && !userRedeemStatus && (
        <div className="flex flex-col gap-10 justify-center items-center">
          <div className="space-y-8 px-20">
            <p className="text-lg font-bold text-center text-white">
              Selamat kamu mendapatkan merchandise {userRedeemType} dari Galeri Indonesia kaya.
            </p>
            <p className="text-xs text-center text-white">
              Hubungi GRO kami untuk mendapatkan bantuan dan pengambilan merchandise.
            </p>
            <p className="text-lg text-center text-white">Kode Redeem: {userRedeemCode}</p>
          </div>

          <Link
            href="/"
            className="bg-primary-orange text-white rounded-full px-12 py-3 shadow-[0_6px_18px_rgba(0,0,0,0.2)]"
          >
            OK, Mengerti
          </Link>
        </div>
      )}
    </div>
  )
}

export default ClaimPage
