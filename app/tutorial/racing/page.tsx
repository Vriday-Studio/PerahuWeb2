'use client'
import Button, { QuizButton } from '@/components/Button'
import PageHeaderTitle from '@/components/Header'
import TypingAnimation from '@/components/animation/typing'
import { Bubble, BubbleHeader, BubbleArrow, BubblePagination } from '@/components/game/bubble'
import { Container } from '@/components/Container'
import React, { useState } from 'react'
import Image from 'next/image'
import GameMaster from '@/components/game/master'
import Loading from '@/components/Loading'
import { useAuth } from '@/components/providers/AuthProvider'
import { redirect, useRouter } from 'next/navigation'
import { useGameStore } from '@/store/game'

const TutorialRacingPage = () => {
  const router = useRouter()
  const [typingAnimationComplete, setTypingAnimationComplete] = useState(false)
  const [contentStep, setContentStep] = useState(0)
  const { setEventType } = useGameStore()

  const { user, isReady } = useAuth()

  if (!isReady) {
    return <Loading />
  }

  if (!user) {
    redirect('/sign-in')
  }

  return (
    <Container>
      {contentStep === 0 && (
        <>
          <div className=" z-10 relative ">
            <PageHeaderTitle>
              <p className="text-lg">Balap Karung</p>
            </PageHeaderTitle>
          </div>
          <div className="h-32"></div>
        </>
      )}
      {contentStep !== 0 && (
        <div className="pt-20 px-5">
          <div className="bg-gray-black border border-primary-brass h-full w-full rounded-[32px] relative z-10">
            <div className="absolute -top-6 w-full flex justify-center">
              <div className="bg-gray-black border border-primary-brass rounded-2xl px-6 py-2 text-primary-brass text-lg">
                Tutorial
              </div>
            </div>
            {/* tutorial image */}
            <div className="flex justify-center items-center pt-20 pb-10">
              <div className="h-72 w-3/4  relative  rounded-3xl flex justify-center items-center ">
                {/* <p className="text-dark-brown text-center">Gambar Tutorial</p> */}
                {contentStep === 1 && (
                  <Image
                    className="w-full h-auto"
                    src="/assets/tutorial/balap-karung.jpg"
                    alt="cloud"
                    width={150}
                    height={40}
                  />
                )}
                {contentStep === 2 && (
                  <Image
                    className="w-full h-auto"
                    src="/assets/tutorial/balap-karung-web.PNG"
                    alt="cloud"
                    width={150}
                    height={40}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="relative -mt-40">
        <div className="relative -left-16 w-full z-10 ">
          <GameMaster
            key={2}
            state={typingAnimationComplete ? 'none' : 'talking'}
            width={300}
            height={150}
          />
        </div>
        <div className="-mt-15 px-5 z-20 relative">
          <Bubble>
            {contentStep === 0 && (
              <>
                <div className="absolute -top-8 -left-5 w-64">
                  <BubbleHeader>
                    <p className="absolute text-white flex items-center justify-center text-center text-base w-full h-full">
                      Balapkarung
                    </p>
                  </BubbleHeader>
                </div>
                <div className="p-5 flex flex-col justify-center items-center relative h-44 text-center gap-5 mt-5">
                  <p className="text-gray-black">
                    <TypingAnimation
                      key={1}
                      text="Main balap karung yuk! Mau aku ajarin?"
                      onAnimationComplete={() => setTypingAnimationComplete(true)}
                    />
                  </p>
                  <div className="flex justify-between w-full gap-5">
                    <Button
                      text="Tidak"
                      onClick={() => {
                        router.push('/play')
                        setEventType('none')
                      }}
                    ></Button>
                    <Button text="ya" onClick={() => setContentStep(contentStep + 1)}></Button>
                  </div>
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
                <div className="absolute -top-8 -left-5 w-64">
                  <BubbleHeader>
                    <p className="absolute text-white flex items-center justify-center text-center text-base w-full h-full">
                      NPC Name
                    </p>
                  </BubbleHeader>
                </div>
                <div className="p-2 px-5  h-48 text-center flex justify-center items-center">
                  <p className="text-gray-black my-3">
                    <TypingAnimation
                      key={2}
                      text="Kalahkan teman-temanmu dengan mencapai garis akhir paling cepat!"
                      onAnimationComplete={() => setTypingAnimationComplete(true)}
                    />
                  </p>
                </div>
                <BubblePagination
                  slideNo={contentStep}
                  onClickBack={() => setContentStep(contentStep - 1)}
                  onClickNext={() => setContentStep(contentStep + 1)}
                  onClickSkip={() => router.push('/game/racing')}
                />
              </>
            )}
            {contentStep === 2 && (
              <>
                <div className="absolute -top-8 -left-5 w-64">
                  <BubbleHeader>
                    <p className="absolute text-white flex items-center justify-center text-center text-base w-full h-full">
                      NPC Name
                    </p>
                  </BubbleHeader>
                </div>
                <div className="p-2 px-5  h-48 text-center flex justify-center items-center">
                  <p className="text-gray-black my-3">
                    <TypingAnimation
                      key={2}
                      text="Tekan tombol saat panah tepat di garis hijau agar avatarmu dapat melompat ke depan"
                      onAnimationComplete={() => setTypingAnimationComplete(true)}
                    />
                  </p>
                </div>
                <BubblePagination
                  slideNo={contentStep}
                  onClickBack={() => setContentStep(contentStep - 1)}
                  onClickNext={() => router.push('/game/racing')}
                  onClickSkip={() => router.push('/game/racing')}
                  isLast={true}
                />
              </>
            )}
            {/* {contentStep === 3 && (
              <>
                <div className="absolute -top-8 -left-5 w-64">
                  <BubbleHeader>
                    <p className="absolute text-white flex items-center justify-center text-center text-base w-full h-full">
                      NPC Name
                    </p>
                  </BubbleHeader>
                </div>
                <div className="p-2 px-5  h-48 text-center flex justify-center items-center">
                  <p className="text-primary-brass my-3">
                    <TypingAnimation
                      key={2}
                      text="Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content."
                      onAnimationComplete={() => setTypingAnimationComplete(true)}
                    />
                  </p>
                </div>
                <BubblePagination
                  slideNo={contentStep}
                  onClickBack={() => setContentStep(contentStep - 1)}
                  onClickNext={() => setContentStep(contentStep + 1)}
                />
              </>
            )} */}
            {/* {contentStep === 3 && (
              <>
                <div className="absolute -top-8 -left-5 w-64">
                  <BubbleHeader>
                    <p className="absolute text-white flex items-center justify-center text-center text-base w-full h-full">
                      NPC Name
                    </p>
                  </BubbleHeader>
                </div>
                <div className="p-2 px-5  h-48 text-center flex justify-center items-center">
                  <p className="text-primary-brass my-3">
                    <TypingAnimation
                      key={2}
                      text="Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content."
                      onAnimationComplete={() => setTypingAnimationComplete(true)}
                    />
                  </p>
                </div>
                <BubblePagination
                  slideNo={contentStep}
                  onClickBack={() => setContentStep(contentStep - 1)}
                  onClickNext={() => router.push('/game/racing')}
                  onClickSkip={() => router.push('/game/racing')}
                  isLast={true}
                />
              </>
            )} */}
          </Bubble>
        </div>
      </div>
    </Container>
  )
}

export default TutorialRacingPage
