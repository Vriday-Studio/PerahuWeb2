import { Container } from '@/components/Container'
import React, { PropsWithChildren, ReactNode, useState } from 'react'
import Button from '../Button'
import TypingAnimation from '../animation/typing'
import { Bubble } from './bubble'
import GameMaster from './master'
import { useUserStore } from '@/store/user'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/game'

const ScoreBoard = ({ data, score, isJuara, points }: any) => (
  <div className="bg-primary-dark border border-primary-brass h-56 w-full rounded-[32px] relative z-10 flex flex-col justify-center items-center">
    <div className="absolute -top-6 w-full flex justify-center">
      <div className="bg-primary-orange rounded-2xl px-6 py-2 text-white text-lg shadow-[0_6px_18px_rgba(0,0,0,0.2)]">
        Congratulations!
      </div>
    </div>
    {isJuara ? (
      <>
        <p className="text-3xl text-white">Juara {localStorage.getItem('playerScore')}</p>
        {typeof points === 'number' && (
          <p className="text-white text-xl mt-2">{points} poin</p>
        )}
      </>
    ) : (
      <p className="text-3xl text-white">{score} poin</p>
    )}
    <div className="absolute bottom-3 flex flex-col justify-center item-center w-full z-50">
      <p className="text-white text-center text-xl">{data.Name}</p>
      <p className="text-white text-sm text-center opacity-75">(tamu)</p>
    </div>
  </div>
)

const GameScore = ({
  score,
  isJuara,
  handleClosedButton,
  showButton = true,
  points,
}: {
  score: number
  handleClosedButton: () => void
  isJuara?: boolean
  showButton?: boolean
  points?: number
}) => {
  const { userData } = useUserStore()
  const [typingAnimationComplete, setTypingAnimationComplete] = useState(false)

  return (
    <Container>
      <div className="px-5 pt-10">
        <ScoreBoard data={userData} score={score} isJuara={isJuara} points={points} />
      </div>
      <div className="relative w-full z-20 flex justify-center items-center mt-10">
        <GameMaster width={347} height={347} state={typingAnimationComplete ? 'none' : 'talking'} />
      </div>

      <div className="relative pb-10 px-5 w-full -mt-5 z-20">
        <Bubble>
          <div className="p-5 flex flex-col gap-5 px-10 justify-center items-center relative h-44 text-center">
            <p className="text-gray-black">
              <TypingAnimation
                text="Tunjukkan layar ini ke petugas GIK untuk menukarkan poin dengan hadiah menarik!"
                onAnimationComplete={() => setTypingAnimationComplete(true)}
              />
            </p>
            {showButton && <Button text="Tutup Layar" onClick={handleClosedButton}></Button>}
          </div>
        </Bubble>
      </div>
    </Container>
  )
}

export default GameScore
