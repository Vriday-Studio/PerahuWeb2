'use client'
import React, { useEffect, useState } from 'react'
import PageHeaderTitle from '@/components/Header'
import { redirect } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { Bubble, BubbleArrow, BubbleHeader } from '@/components/game/bubble'
import Loading from '@/components/Loading'
import { QuizButton, QuizLifeLineButton } from '@/components/Button'
import TypingAnimation from '@/components/animation/typing'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import GameMaster from '@/components/game/master'
import { useGameStore } from '@/store/game'
import axios from 'axios'
import { useMutation } from 'react-query'
import { Container } from '@/components/Container'

const Sample = ({ contentStep }: any) => (
  <>
    <Bubble>
      <div className="absolute -top-8 -left-5 w-64">
        <BubbleHeader>
          <p className="absolute text-white flex items-center justify-center text-center text-base w-full h-full">
            Pertanyaan 1
          </p>
        </BubbleHeader>
      </div>
      <div className="p-5 flex justify-center items-center relative h-44 text-center">
        <p className="text-gray-black">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam odio erat, faucibus nec
          ligula quis, lacinia interdum felis. Mauris congue dui dolor, eget hendrerit risus posuere
          sit amet.
        </p>
      </div>
      <div className="absolute  w-auto flex gap-2 -bottom-5 right-0 z-30">
        {contentStep === 2 && (
          <>
            <motion.div
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <QuizLifeLineButton text="HINT" />
            </motion.div>
            <motion.div
              key={`${1}`}
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <QuizLifeLineButton text="50:50" />
            </motion.div>
          </>
        )}
      </div>
    </Bubble>
    <div className="mt-5"></div>
    <QuizButton text="Lorem ipsum dolor sit amet" />
    <QuizButton text="Contoh jawaban benar" />
    <QuizButton text="Lorem ipsum dolor sit amet" />
    <QuizButton text="Contoh jawaban salah" />
  </>
)

const QuizPage = () => {
  const router = useRouter()
  const [typingAnimationComplete, setTypingAnimationComplete] = useState(false)
  const [contentStep, setContentStep] = useState(0)
  const { eventType, setEventType, _isInEvent, setStartGame } = useGameStore()

  const { user, isReady } = useAuth()

  useEffect(() => {
    if (!user) return
    // redirectByEventType(router, eventType, _isInEvent)
  }, [user, eventType, _isInEvent, router])

  const mutation = useMutation({
    mutationFn: async () => {
      return await axios.post(
        `/api/quiz`,
        {
          reset: true,
          userId: user?.id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    },
    onSuccess: (data) => {},
    onError: (data) => {
      console.log(data)
    },
  })

  const handlePlayButton = () => {
    setContentStep(contentStep + 1)
    mutation.mutate()
  }

  if (!isReady) {
    return <Loading />
  }

  if (!user) {
    redirect('/sign-in')
  }

  if (user && eventType === 'quiz') {
    return (
      <Container>
        {contentStep !== 2 && (
          <div className="pt-5 px-2 z-10 relative ">
            <PageHeaderTitle>
              <p className="text-lg">Quiz Minigame</p>
            </PageHeaderTitle>
          </div>
        )}

        {contentStep !== 2 && (
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
        )}
        {contentStep === 2 && (
          <div className="p-5 pt-10 h-[650px]">
            <Sample contentStep={contentStep} />
          </div>
        )}

        {contentStep === 2 && (
          <div className="absolute bottom-40  -left-24 w-full z-20 ">
            <GameMaster
              key={2}
              state={typingAnimationComplete ? 'none' : 'talking'}
              width={375}
              height={375}
            />
          </div>
        )}
        {contentStep === 2 && <div className="fixed inset-0 bg-black opacity-50 z-10"></div>}
        <div className="px-5 w-full  pb-5 relative z-20">
          <Bubble>
            {contentStep === 0 && (
              <>
                <div className="absolute -top-8 -left-5 w-64">
                  <BubbleHeader>
                    <p className="absolute text-white flex items-center justify-center text-center text-base w-full h-full">
                      Quiz Master
                    </p>
                  </BubbleHeader>
                </div>
                <div className="p-5 flex justify-center items-center relative h-44 text-center">
                  <p className="text-gray-black">
                    <TypingAnimation
                      key={1}
                      text="Halo. Di sini saya menyediakan permainan quiz. Apakah anda ingin bermain?"
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
                  <p className="text-gray-black my-3">Apakah anda ingin bermain quiz?</p>
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
                      Quiz Master
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
                    onClick={() => router.push('/tutorial/quiz')}
                  />
                  <QuizButton
                    text="Tidak, saya ingin langsung bermain."
                    type="button"
                    onClick={() => router.push('/game/quiz')}
                  />
                </div>
              </>
            )}
          </Bubble>
        </div>
      </Container>
    )
  }

  return <Loading />
}

export default QuizPage
