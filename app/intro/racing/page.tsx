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
import { Container } from '@/components/Container'

const RacingIntroPage = () => {
  const router = useRouter()
  const [typingAnimationComplete, setTypingAnimationComplete] = useState(false)
  const [contentStep, setContentStep] = useState(0)
  const { eventType, setEventType, _isInEvent, setStartGame } = useGameStore()
  //let url='/tutorial/racing'
  
  const { user, isReady } = useAuth()
 
  
  useEffect(() => {
    if (!user) return
    // redirectByEventType(router, eventType, _isInEvent)
  }, [user, eventType, _isInEvent, router])

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
          <p className="text-lg">Balap Karung</p>
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
                    Balap Master
                  </p>
                </BubbleHeader>
              </div>
              <div className="p-5 flex justify-center items-center relative h-44 text-center">
                <p className="text-gray-black">
                  <TypingAnimation
                    key={1}
                    text="Halo. Disini saya menyediakan game balap karung. Apakah kamu ingin bermain?"
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
                <p className="text-gray-black my-3">Apakah Anda ingin bermain game balap karung?</p>
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
                    router.push('/play')
                    setEventType('none')
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
                    Balap Master
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
                <p className="text-gray-black my-3">Apakah anda ingin mendengar penjelasan?</p>
                <QuizButton
                  text="Ya, beri tahu saya cara bermain."
                  type="button"
                  onClick={() => router.push('/tutorial/racing')}
                />
                <QuizButton
                  text="Tidak, saya ingin langsung bermain."
                  type="button"
                  onClick={() => router.push('/game/racing')}
                />
              </div>
            </>
          )}
        </Bubble>
      </div>
    </Container>
  )
}

export default RacingIntroPage
