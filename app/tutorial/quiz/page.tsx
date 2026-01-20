'use client'
import { QuizButton } from '@/components/Button'
import PageHeaderTitle from '@/components/Header'
import TypingAnimation from '@/components/animation/typing'
import { Bubble, BubbleHeader, BubbleArrow } from '@/components/game/bubble'
import { Container } from '@/components/Container'
import React, { useState } from 'react'

const TutorialQuizPage = () => {
  const [typingAnimationComplete, setTypingAnimationComplete] = useState(false)
  const [contentStep, setContentStep] = useState(0)

  return (
    <Container>
      <div className="pt-5 px-2 z-10 relative ">
        <PageHeaderTitle>
          <p className="text-lg">Quiz</p>
        </PageHeaderTitle>
      </div>
      <div className="flex justify-center items-center py-5">
        <div className="h-80 w-3/4 bg-gray-black border border-primary-brass relative rounded-3xl flex justify-center items-center px-10">
          <p className="text-white text-center">screenshot footage permainan (still image)</p>
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
                    text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam odio erat, faucibus nec ligula quis, lacinia interdum felis. Mauris congue dui dolor, eget hendrerit risus posuere sit amet."
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
                    text="Teks penjelasan part 2 (dan seterusnya kalau ada part lain)"
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
              <div className="p-2 px-5  h-48 text-center">
                <p className="text-gray-black my-3">Apakah penjelasan permainan sudah jelas?</p>
                <QuizButton text="Ya, saya siap bermain." type="button" />
                <QuizButton
                  text="Tolong ulangi kembali."
                  type="button"
                  onClick={() => setContentStep(1)}
                />
              </div>
            </>
          )}
        </Bubble>
      </div>
    </Container>
  )
}

export default TutorialQuizPage
