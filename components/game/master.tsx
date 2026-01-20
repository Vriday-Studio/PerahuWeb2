'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useGameStore } from '@/store/game'

type TMasterState = 'talking' | 'none'

type QuizMasterProps = {
  state?: TMasterState
  width?: number
  height?: number
}

const QuizMaster = ({ state, width, height }: QuizMasterProps) => {
  const [showFirstImage, setShowFirstImage] = useState(true)
  useEffect(() => {
    let imageToggleInterval = 1000
    let imageToggleIntervalId: string | number | NodeJS.Timeout | undefined

    const startAnimation = () => {
      imageToggleIntervalId = setInterval(() => {
        setShowFirstImage((prevShowFirstImage) => !prevShowFirstImage)
      }, imageToggleInterval)
    }

    // Start animation only when the state is 'talking'
    if (state === 'talking') {
      startAnimation()
    }

    return () => {
      clearInterval(imageToggleIntervalId)
    }
  }, [state])

  return (
    <>
      {showFirstImage && state === 'talking' ? (
        <Image
          src="/assets/character/quizmaster_talk.svg"
          alt="quiz master image"
          width={width ? width : 0}
          height={height ? height : 0}
          className={`w-[${width}] h-auto relative`}
          priority
        />
      ) : (
        <Image
          src="/assets/character/quizmaster.svg"
          alt="quiz master image"
          width={width ? width : 0}
          height={height ? height : 0}
          className={`w-[${width}] h-auto relative`}
          priority
        />
      )}
    </>
  )
}

const TreasureHuntMaster = ({ width, height }: QuizMasterProps) => {
  return (
    <div>
      <Image
        src="/assets/character/treasurehunt_webA.svg"
        alt="quiz master image"
        width={width ? width : 0}
        height={height ? height : 0}
        className={`w-[${width}] h-auto relative`}
      />
    </div>
  )
}

const RacingMaster = ({ width, height }: QuizMasterProps) => {
  return (
    <div>
      <Image
        src="/assets/character/balapkarung_webA.svg"
        alt="quiz master image"
        width={width ? width : 0}
        height={height ? height : 0}
        className={`w-[${width}] h-auto relative`}
      />
    </div>
  )
}

const GameMaster = ({ state, width, height }: QuizMasterProps) => {
  const { eventType } = useGameStore()

  return (
    <>
      {eventType === 'quiz' && <QuizMaster state={state} width={width} height={height} />}
      {eventType === 'treasure_hunt' && <TreasureHuntMaster width={width} height={height} />}
      {eventType === 'racing' && <RacingMaster width={width} height={height} />}
    </>
  )
}

export default GameMaster
