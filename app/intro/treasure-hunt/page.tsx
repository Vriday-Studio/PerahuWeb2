'use client'
import PageHeaderTitle from '@/components/Header'
import React, { useEffect, useState } from 'react'
import GameMaster from '@/components/game/master'
import { useAuth } from '@/components/providers/AuthProvider'
import { redirect } from 'next/navigation'
import Loading from '@/components/Loading'
import { QuizButton } from '@/components/Button'
import TypingAnimation from '@/components/animation/typing'
import { Bubble, BubbleHeader, BubbleArrow } from '@/components/game/bubble'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/game'
import redirectByEventType from '@/utils/redirectByEventType'
import { Container } from '@/components/Container'
import { set, ref } from 'firebase/database'
import { database } from '@/app/firebase' // Tambahkan ini di bagian import

const TreasureHuntIntroPage = () => {
  const router = useRouter()
  const [typingAnimationComplete, setTypingAnimationComplete] = useState(false)
  const [contentStep, setContentStep] = useState(0)
  const { eventType, setEventType, _isInEvent, _treasureHuntStatus, setTimeWait, setStartGame } = useGameStore()

  const { user, isReady } = useAuth()

  useEffect(() => {
    if (!user) return
    if (eventType === 'none') return
    redirectByEventType(router, eventType, _isInEvent, _treasureHuntStatus)
  }, [user, eventType, _isInEvent, _treasureHuntStatus, router])

  const handlePlayButton = () => {
    setContentStep(contentStep + 1)
  }

  if (!isReady) {
    return <Loading />
  }

  if (!user) {
    redirect('/sign-in')
  }

  return (
    <Container>
      <div className="pt-5 px-2 z-10 relative ">
        <PageHeaderTitle>
          <p className="text-lg">Treasure Hunt</p>
        </PageHeaderTitle>
      </div>
      <div
        className={` z-10 m-auto w-full flex flex-col justify-center items-center relative mt-10 ${
          contentStep === 1 && 'filter grayscale-[75%]'
        }`}
      >
        <GameMaster
          key={1}
          state={typingAnimationComplete ? 'none' : 'talking'}
          width={375}
          height={375}
        />
      </div>
      <div className="px-5 w-full  pb-5 relative z-20">
        <Bubble>
          {contentStep === 0 && (
            <>
              <div className="absolute -top-8 -left-5 w-64">
                <BubbleHeader>
                  <p className="absolute text-white flex items-center justify-center text-center text-base w-full h-full">
                    Treasure Master
                  </p>
                </BubbleHeader>
              </div>
              <div className="p-5 flex justify-center items-center relative h-44 text-center">
                <p className="text-gray-black">
                  <TypingAnimation
                    key={1}
                    text="Halo. Di sini saya menyediakan permainan treasure hunt atau berburu harta karun. Apakah anda ingin bermain?"
                    onAnimationComplete={() => setTypingAnimationComplete(true)}
                  />
                </p>
              </div>
              <BubbleArrow
                onClick={() => {
                  setContentStep(contentStep + 1)
                  setTypingAnimationComplete(false)
                }}
              />
            </>
          )}
          {contentStep === 1 && (
            <>
              <div className="p-2 px-5  h-48 text-center">
                <p className="text-gray-black my-3">Apakah anda ingin bermain treasure hunt?</p>
                <QuizButton
                  text="Ya, saya ingin bermain"
                  type="button"
                  onClick={handlePlayButton}
                />
                <QuizButton
                  text="Tidak, terima kasih"
                  type="button"
                  onClick={() => {
                    setStartGame(true)
                    setEventType('none')
                    router.push('/play')
                  }}
                />
              </div>
            </>
          )}
          {contentStep === 2 && (
            <>
              <div className="absolute -top-8 -left-5 w-64">
                <BubbleHeader>
                  <p className="absolute text-white flex items-center justify-center text-center text-base w-full h-full">
                    Treasure Master
                  </p>
                </BubbleHeader>
              </div>
              <div className="p-5 flex justify-center items-center relative h-44 text-center">
                <p className="text-gray-black">
                  <TypingAnimation
                    key={2}
                    text="Apakah anda ingin mendengar penjelasan mengenai permainan ini?"
                    onAnimationComplete={() => setTypingAnimationComplete(true)}
                  />
                </p>
              </div>
              <BubbleArrow onClick={() => setContentStep(contentStep + 1)} />
            </>
          )}
          {contentStep === 3 && (
            <>
              <div className="p-2 px-5  h-48 text-center">
                <p className="text-primary-brass my-3">Apakah anda ingin mendengar penjelasan?</p>
                <QuizButton
                  text="Ya, beri tahu saya cara bermain."
                  type="button"
                  onClick={() => router.push('/tutorial/treasure-hunt')}
                />
                <QuizButton
                  text="Tidak, saya ingin langsung bermain."
                  type="button"
                  onClick={() => {
                    router.push('/game/treasure-hunt')
                    set(ref(database, 'count/Treasure/state/state/'), 'siapwait');
                   // set(ref(database, 'count/Treasure/Status/stats'), 'wait');
                    setTimeWait(true)
                   // setTreasureHuntStatus('wait')
                  }}
                />
              </div>
            </>
          )}
        </Bubble>
      </div>
    </Container>
  )
}

export default TreasureHuntIntroPage
