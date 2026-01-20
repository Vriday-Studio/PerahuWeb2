'use client'
import { QuizButton } from '@/components/Button'
import { Container } from '@/components/Container'
import PageHeaderTitle from '@/components/Header'
import TypingAnimation from '@/components/animation/typing'
import { Bubble, BubbleHeader, BubbleArrow } from '@/components/game/bubble'
import { useGameStore } from '@/store/game'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Image from 'next/image'

const TutorialTreasureHuntPage = () => {
  const router = useRouter()
  const [typingAnimationComplete, setTypingAnimationComplete] = useState(false)
  const [contentStep, setContentStep] = useState(0)
  const { setTimeWait } = useGameStore()

  return (
    <Container>
      <div className="pt-5 px-2 z-10 relative ">
        <PageHeaderTitle>
          <p className="text-lg">Treasure Hunt</p>
        </PageHeaderTitle>
      </div>
      <div className="flex justify-center items-center py-5">
        <div className="h-80 w-3/4 bg-gray-black border border-primary-brass relative rounded-3xl flex justify-center items-center p-5 ">
          {/* <p className="text-white text-center">screenshot footage permainan (still image)</p> */}
          {contentStep === 0 && (
            <Image
              className="w-full h-auto rounded-xl"
              src="/assets/tutorial/treasure-hunt.jpg"
              alt="cloud"
              width={150}
              height={40}
            />
          )}
          {contentStep === 1 && (
            <Image
              className="w-full h-auto rounded-xl"
              src="/assets/tutorial/treasure-hunt-1.jpg"
              alt="cloud"
              width={150}
              height={40}
            />
          )}
          {contentStep === 2 && (
            <Image
              className="w-full h-auto rounded-xl"
              src="/assets/tutorial/treasure-hunt-1.jpg"
              alt="cloud"
              width={150}
              height={40}
            />
          )}
          {contentStep === 3 && (
            <Image
              className="w-full h-auto rounded-xl"
              src="/assets/tutorial/treasure-hunt-1.jpg"
              alt="cloud"
              width={150}
              height={40}
            />
          )}
        </div>
      </div>
      <div className="mt-5 px-5">
        <Bubble>
          {contentStep === 0 && (
            <>
              <div className="absolute -top-8 -left-5 w-64">
                <BubbleHeader>
                  <p className="absolute text-white flex items-center justify-center text-center text-base w-full h-full">
                    NPC Name
                  </p>
                </BubbleHeader>
              </div>
              <div className="p-5 flex justify-center items-center relative h-44 text-center">
                <p className="text-gray-black">
                  <TypingAnimation
                    key={1}
                    text="Carilah dan kumpulkan benda sesuai list dibawah layar bersama teman-temanmu"
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
                    text="Kumpulkan benda sebanyak dan secepat mungkin sebelum waktu di timer habis."
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
                  {/* <TypingAnimation
                    key={2}
                    text="The one with the most points wins!"
                    onAnimationComplete={() => setTypingAnimationComplete(true)}
                  /> */}
                  Yang memiliki poin terbanyak adalah pemenangnya!
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
          {contentStep === 3 && (
            <>
              <div className="p-2 px-5  h-48 text-center">
                <p className="text-gray-black my-3">Apakah penjelasan permainan sudah jelas?</p>
                <QuizButton
                  text="Ya, saya siap bermain."
                  type="button"
                  onClick={() => {
                    router.push('/game/treasure-hunt')
                    setTimeWait(true)
                  }}
                />
                <QuizButton
                  text="Tolong ulangi kembali."
                  type="button"
                  onClick={() => setContentStep(0)}
                />
              </div>
            </>
          )}
        </Bubble>
      </div>
    </Container>
  )
}

export default TutorialTreasureHuntPage
