'use client'
import React, { useEffect } from 'react'
import AvatarPlayer from '@/components/avatar/AvatarPlayer'
import PageHeaderTitle from '@/components/Header'
import Button, { ButtonIcon } from '@/components/Button'
import { redirect, useRouter } from 'next/navigation'
import Loading from '@/components/Loading'
import { useUserStore } from '@/store/user'
import { database } from '@/app/firebase'
import { ref, update } from 'firebase/database'
import { useGameStore } from '@/store/game'
import { useAvatarStore } from '@/store/avatar'
import { useStore } from 'zustand'
import { useAuth } from '@/components/providers/AuthProvider'
import { Container } from '@/components/Container'

const AvatarProfile = () => {
  const router = useRouter()
  const { user, isReady, logoutUser } = useAuth()

  const { userData, setUserData, resetUserData } = useUserStore()
  const { resetGameStore, setStartGame } = useGameStore()

  const isAnonymous = (user as { isAnonymous?: boolean })?.isAnonymous

  const store = useStore(useAvatarStore, (state) => state)

  const handleSignOut = async () => {
    // const dbUserRef = ref(database, 'Users/' + userData.userID)
    // await update(dbUserRef, {
    //   ismove: 'LogOff',
    //   moveX: 0,
    //   moveY: 0,
    //   lastLogin: new Date(),
    //   isMessage: 'false',
    // })
    await logoutUser()
    resetGameStore()
    resetUserData()
  }

  const handleAvatar = async () => {
    // if anonymous/guess account change gender and avatar
    if (isAnonymous) {
      const dbRef = ref(database, 'Users/' + userData.userID)
      await update(dbRef, {
        Gender: userData.Gender === 'male' ? 'female' : 'male',
        avatar:
          userData.Gender === 'male'
            ? '0, 0, 0, 0, 0, 10, 0, 12, 12, 12, 0, 0, 0, 0, 0'
            : '1, 13, 0, 0, 1, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0',
      })
      store?.setGender()
      setUserData(user)
    } else {
      router.push('/avatar')
    }
  }

  const handleStartGame = async () => {
    // setIsInitialized(true)
    setStartGame(true)
    router.push('/play')
  }

  useEffect(() => {
    if (!user) return
    setUserData(user)
  }, [user, setUserData])

  if (!isReady) {
    return <Loading />
  }

  if (!user) {
    redirect('/sign-in')
  }

  return (
    <Container>
      <div className="py-10 px-2">
        <PageHeaderTitle>
          <p className="text-lg">Halo, {userData?.Name}</p>
        </PageHeaderTitle>
      </div>
      <div className="absolute right-5 top-5">
        <ButtonIcon image_path="/assets/ui/menu/back-icon-2.svg" onClick={() => router.push('/')} />
      </div>

      <div className="z-20 pt-14 m-auto w-full flex flex-col justify-center items-center relative">
        <AvatarPlayer width={521} height={521} />
        <div className="px-10 w-full z-10 mt-5">
          <Button text="Ubah Avatar" onClick={handleAvatar} />
          <div className="mb-2"></div>
          <Button text="Mainkan Game" onClick={handleStartGame} />
          <div className="mb-2"></div>
          {/* <Button text="Keluar dari Permainan" onClick={handleSignOut} /> */}
        </div>
      </div>
    </Container>
  )
}

export default AvatarProfile
