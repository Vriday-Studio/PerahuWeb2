'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Carousel from '@/components/Carousel'
import { useAuth } from '@/components/providers/AuthProvider'
import { getSelectedUserPoints } from '@/lib/firebase/users'
import { getContentSettingByTag } from '@/lib/firebase/contentSetting'
import LoadingScreen from '@/components/LoadingScreen'
import { getCanClaim } from '@/lib/firebase/quiz'

const LandingHome = () => {
  const { user, logoutUser } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedContent, setSelectedContent] = useState<any>(null)
  const [userPoint, setUserPoint] = useState('')
  const [canClaim, setCanClaim] = useState(false)

  const redirectUserUrl = '/welcome'
  const localCarouselImages = ['/images/image 5.png']

  const getUserPoint = async () => {
    if (!user?.id) return
    const point = await getSelectedUserPoints(String(user.id))
    setUserPoint(String(point))
  }

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const contents = await getContentSettingByTag('content')
        const taggedContents = contents.filter((item: any) => item.tag === 'home')
        const latestContent = taggedContents.sort((a: any, b: any) => {
          const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime()
          const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime()
          return timeB - timeA
        })[0]
        setSelectedContent(latestContent || null)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [])

  useEffect(() => {
    if (!user?.id) return
    const fetchData = async () => {
      try {
        const claim = await getCanClaim()
        setCanClaim(Boolean(claim))
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
    getUserPoint()
  }, [user])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="font-playfair h-screen flex flex-col">
      <div className="relative">
        <Image
          src="/images/logo-galeri-indonesia-kaya.png"
          alt="Galeri Indonesia Kaya"
          width={320}
          height={80}
          className="w-1/2 absolute top-5 left-1/2 -translate-x-1/2 z-20"
        />
      </div>
      <div className="relative w-full h-2/5">
        <Carousel autoSlide animationType="fade" hideNavigation hidePagination>
          {(selectedContent?.images?.length ? selectedContent.images : localCarouselImages).map((src: string) => (
            <div key={src} className="w-full h-full flex items-center justify-center">
              <img
                src={src}
                className="w-full h-full object-cover object-center"
                alt="Interaktif Indonesia Kaya"
              />
            </div>
          )) || []}
        </Carousel>
        <div className="absolute top-0 bg-gradient-to-t from-primary-darker w-full h-full z-10"></div>
      </div>
      <div className="relative h-full text-primary-brass flex flex-col items-center gap-2 -mt-10 z-50">
        <p className="text-xs tracking-widest">JELAJAH</p>
        <h1 className="text-3xl font-bold">Indonesia Kaya</h1>
        <div className="grid grid-cols-2 gap-2 w-full max-w-md px-10 mt-3">
          <Link
            href="/about/interaktif-indonesia-kaya"
            className="border border-soft-cream bg-primary-darker text-soft-cream rounded-xl text-center content-center px-5 py-2 text-xs"
          >
            Tentang <br /> Interaktif Indonesia Kaya
          </Link>
          <Link
            href="/about/galeri-indonesia-kaya"
            className="border border-soft-cream bg-primary-darker text-soft-cream rounded-xl text-center content-center px-5 py-2 text-xs"
          >
            Tentang <br /> Galeri Indonesia Kaya
          </Link>
          <Link
            href={user ? redirectUserUrl : '/sign-in'}
            className="bg-primary-orange text-white rounded-2xl text-center px-5 py-6 col-span-2 flex items-center justify-evenly shadow-[0_6px_18px_rgba(0,0,0,0.2)]"
          >
            <svg width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16.6399 7.71892C16.4125 7.37623 16.1185 7.08152 15.7746 6.85313C16.1256 6.63061 16.424 6.34153 16.6564 6.00737C16.8838 6.35005 17.1778 6.64477 17.5217 6.87316C17.1707 7.09568 16.8723 7.38476 16.6399 7.71892Z"
                fill="white"
                stroke="white"
                strokeWidth="5"
              />
              <path
                d="M6.31254 16.895C6.32894 16.8795 6.34516 16.8638 6.36118 16.848C6.37737 16.8647 6.39375 16.8812 6.41032 16.8975C6.39392 16.913 6.37771 16.9286 6.36168 16.9445C6.3455 16.9278 6.32912 16.9113 6.31254 16.895Z"
                fill="white"
                stroke="white"
                strokeWidth="5"
              />
              <path
                d="M18.3619 24.1455C18.3783 24.13 18.3945 24.1143 18.4105 24.0985C18.4267 24.1152 18.4431 24.1317 18.4596 24.148C18.4432 24.1635 18.427 24.1791 18.411 24.195C18.3948 24.1783 18.3784 24.1618 18.3619 24.1455Z"
                fill="white"
                stroke="white"
                strokeWidth="5"
              />
            </svg>

            <p className="text-xl">Mulai main game</p>
          </Link>
          <div className="col-span-2 w-full border border-soft-cream bg-primary-darker text-soft-cream rounded-2xl text-center p-4 text-xs flex flex-col items-center">
            {user ? (
              <>
                <p className="text-nowrap">Halo, {user.Nama}</p>
                <div className="flex gap-5">
                  <button
                    onClick={logoutUser}
                    className="w-full my-2 underline underline-offset-4 text-nowrap w-webkit-max-content"
                  >
                    Logout
                  </button>
                </div>

                <div className="text-xs pb-2 mt-2 w-3/4 text-center">Poin: {userPoint || 0}</div>
                <Link
                  href="/profile"
                  className="bg-primary-orange text-white rounded-2xl mt-4 p-2 w-3/4 shadow-[0_6px_18px_rgba(0,0,0,0.2)]"
                >
                  Lihat Profil
                </Link>
                {canClaim && (
                  <Link
                    href="/claim"
                    className="bg-primary-orange text-white rounded-2xl mt-4 p-2 w-3/4 shadow-[0_6px_18px_rgba(0,0,0,0.2)]"
                  >
                    Klaim Hadiah
                  </Link>
                )}
              </>
            ) : (
              <Link href="/sign-in" className="w-full text-lg underline underline-offset-4">
                Masuk / Daftar
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingHome
