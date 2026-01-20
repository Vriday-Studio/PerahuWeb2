'use client'
import Button from '@/components/Button'
import TypingAnimation from '@/components/animation/typing'
import { Bubble, BubbleArrow, BubbleHeader } from '@/components/game/bubble'
import { useGameStore } from '@/store/game'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import GameMaster from '../../master'
import { Container } from '@/components/Container'

const ScoreBoard = ({ data }: any) => (
  <div className="bg-primary-dark border border-primary-brass h-56 w-full rounded-[32px] relative z-10">
    <div className="absolute -top-6 w-full flex justify-center">
      <div className="bg-primary-orange rounded-2xl px-6 py-2 text-white text-lg shadow-[0_6px_18px_rgba(0,0,0,0.2)]">
        Congratulations!
      </div>
    </div>
    <p className="text-3xl text-white flex justify-center items-center h-full">
      {data.playerScore} poin
    </p>
    <div className="absolute bottom-3 flex flex-col justify-center item-center w-full z-50">
      <p className="text-white text-center text-xl">{data.user.Nama}</p>
      <p className="text-white text-sm text-center opacity-75">(tamu)</p>
    </div>
  </div>
)

const QuizGameScorePage = () => {
  const router = useRouter()
  const [typingAnimationComplete, setTypingAnimationComplete] = useState(false)

  const { user } = useAuth()
  const { data: quizData, refetch } = useQuery<any>({
    queryKey: ['quizMaster'],
    queryFn: async () => {
      return await axios.get(`/api/quiz`, { params: { userId: user?.id } })
    },
    staleTime: Infinity,
    enabled: Boolean(user?.id),
  })

  const { setEventType } = useGameStore()

  useEffect(() => {
    if (!user?.id) return
    refetch()
  }, [user?.id, refetch])

  const [contentStep, setContentStep] = useState(0)

  const handleCloseButton = () => {
    setEventType('none')
    router.push('/play')
  }

  return (
    // <div className="bg-beige h-full min-h-screen max-w-md  m-auto  relative ">
    //   <Image
    //     src="/assets/cloud/quiz/cloud-top-left.png"
    //     alt="cloud background left"
    //     width={217}
    //     height={172}
    //     className="w-40 h-auto absolute top-1/5 "
    //   />
    //   <Image
    //     src="/assets/cloud/quiz/cloud-center-left.png"
    //     alt="cloud background left"
    //     width={217}
    //     height={172}
    //     className="w-96 h-auto absolute top-[35%]"
    //   />
    //   <Image
    //     src="/assets/cloud/quiz/cloud-top-right.png"
    //     alt="cloud background center"
    //     width={321}
    //     height={355}
    //     className="w-56 h-auto absolute top-10 right-0 -z-0"
    //   />
    //   <Image
    //     src="/assets/ui/bg/profile-avatar/land.svg"
    //     alt="land"
    //     width={420}
    //     height={375}
    //     className="w-full h-[375px] absolute bottom-0 -z-0 object-cover"
    //     priority
    //   />
    <Container>
      <div className="px-5 pt-10">
        <ScoreBoard data={quizData?.data} />
      </div>
      <div className="relative w-full z-20 flex justify-center items-center mt-10">
        <GameMaster width={347} height={347} state={typingAnimationComplete ? 'none' : 'talking'} />
      </div>

      <div className="relative pb-10 px-5 w-full -mt-5 z-20">
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
                    text={`${
                      quizData.data.playerScore === 100
                        ? 'Wah! Nilai sempurna! Hebat sekali!'
                        : quizData.data.playerScore < 60
                        ? `Terima kasih telah ikut menjawab pertanyaan! Yuk coba lagi untuk mendapatkan suvenir dari Galeri Indonesia Kaya!`
                        : `Selamat, kamu berhasil menjawab semua pertanyaan! 🎉 Anda telah mencetak ${quizData.data.playerScore} poin yang mengesankan! Silakan menghubungi staf Galeri Indonesia Kaya untuk mendapatkan suvenir menarik (*Suvenir hanya bisa ditukar hari ini saja)`
                    }`}
                    onAnimationComplete={() => setTypingAnimationComplete(true)}
                  />
                </p>
              </div>
              <BubbleArrow
                onClick={() => {
                  setContentStep(1)
                  setTypingAnimationComplete(false)
                }}
              />
            </>
          )}
          {contentStep === 1 && (
            <div className="p-5 flex flex-col gap-5 px-10 justify-center items-center relative h-44 text-center">
              <p className="text-gray-black">
                <TypingAnimation
                  text="Tunjukkan layar ini ke petugas GIK untuk menukarkan poin dengan hadiah menarik!"
                  onAnimationComplete={() => setTypingAnimationComplete(true)}
                />
              </p>
              <Button text="Tutup Layar" onClick={handleCloseButton}></Button>
            </div>
          )}
        </Bubble>
      </div>
    </Container>
    // </div>
  )
}

export default QuizGameScorePage
