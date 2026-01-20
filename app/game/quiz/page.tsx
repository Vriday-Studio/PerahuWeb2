'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { useAuth } from '@/components/providers/AuthProvider'
import { redirect, useRouter } from 'next/navigation'
import Loading from '@/components/Loading'
import { useMutation, useQuery } from 'react-query'
import axios from 'axios'
import BackIcon from '@/components/BackIcon'
import QuizGameScorePage from '@/components/game/quiz/score/page'
import { useGameStore } from '@/store/game'
import { QuizLifeLineButton } from '@/components/Button'
import QuizHintModal from '@/components/modal/quiz-hint'

type QuizQuestion = {
  id: number
  soal: string
  a?: string
  b?: string
  c?: string
  d?: string
  link?: string | null
  questionNo?: number
  point?: number
}

type AnswerStatus = boolean | null
type HiddenLettersByIndex = Record<number, string[]>

const QuizPagination = ({ answersStatus }: { answersStatus: AnswerStatus[] }) => (
  <div className="flex justify-center gap-2">
    {answersStatus.map((status, index) => (
      <div
        key={index}
        className={`w-8 h-8 rounded-sm flex justify-center items-center text-white text-sm ${
          status === true ? 'bg-correct' : status === false ? 'bg-wrong' : 'bg-not-answered'
        }`}
      >
        ?
      </div>
    ))}
  </div>
)
const QuizPaginationGrid = ({ answersStatus }: { answersStatus: AnswerStatus[] }) => {
  const firstRow = answersStatus.slice(0, 5)
  const secondRow = answersStatus.slice(5, 10)
  return (
    <div className="flex flex-col items-center gap-2">
      <QuizPagination answersStatus={firstRow} />
      {secondRow.length > 0 && <QuizPagination answersStatus={secondRow} />}
    </div>
  )
}

const QuizSlides = ({
  title,
  quizIndex,
  question,
  lastQuestion,
  answersStatus,
  hiddenLetters,
  hintLifeLine,
  fiftyFiftyLifeLine,
  onHint,
  onFiftyFifty,
  onAnswer,
  isSubmitting,
}: {
  title: string
  quizIndex: number
  question: QuizQuestion
  lastQuestion: boolean
  answersStatus: AnswerStatus[]
  hiddenLetters: string[]
  hintLifeLine: number
  fiftyFiftyLifeLine: number
  onHint: () => void
  onFiftyFifty: () => void
  onAnswer: (payload: { id: number; letter: string; index: number; options: Array<{ letter: string; label: string }> }) => void
  isSubmitting: boolean
}) => {
  const options = [
    { letter: 'a', label: question.a || '' },
    { letter: 'b', label: question.b || '' },
    { letter: 'c', label: question.c || '' },
    { letter: 'd', label: question.d || '' },
  ].filter((option) => option.label)

  const handleAnswer = (letter: string) => {
    if (isSubmitting) return
    onAnswer({ id: question.id, letter, index: quizIndex, options })
  }

  return (
    <div className="min-h-screen flex-shrink-0 bg-cream w-full overflow-hidden flex flex-col">
        <div className="relative flex flex-col justify-start items-center gap-2 px-10 pt-4 pb-10 w-full bg-primary-orange h-[32vh] overflow-hidden">
        <h1 className="text-xl font-bold text-white px-5 text-center">{title}</h1>
        <div className="bg-cream text-primary-brass rounded-2xl py-1 px-10 mt-2 shadow-[0_6px_18px_rgba(0,0,0,0.2)]">
          {question.point ?? 10}
        </div>
        <Image
          src="/images/bg-auth.png"
          alt="bg-auth"
          fill
          sizes="100vw"
          className="object-cover opacity-30 -z-10"
        />
      </div>
      <div className="relative bg-cream border border-cream rounded-t-[48px] -mt-10 py-6 z-20 flex-1">
        <div className="flex flex-col justify-start items-center gap-3 w-full px-8 text-center text-sm text-gray-black">
          <QuizPaginationGrid answersStatus={answersStatus} />
          <div className="flex justify-center gap-2">
            <QuizLifeLineButton
              text={`HINT ${hintLifeLine}`}
              onClick={onHint}
              disabled={hintLifeLine === 0}
            />
            <QuizLifeLineButton
              text={`50/50 ${fiftyFiftyLifeLine}`}
              onClick={onFiftyFifty}
              disabled={fiftyFiftyLifeLine === 0}
            />
          </div>
          <p className="text-[13px] leading-relaxed">{question.soal}</p>
          <div className="flex flex-col gap-2 w-full">
            {options.map((option) => (
              <button
                key={option.letter}
                onClick={() => handleAnswer(option.letter)}
                className={`bg-gray-black text-primary-brass py-3 px-4 w-full rounded-lg border border-primary-brass shadow-[0_6px_18px_rgba(0,0,0,0.2)] text-sm ${
                  hiddenLetters.includes(option.letter) ? 'opacity-0 pointer-events-none' : ''
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {lastQuestion && <div className="h-24" />}
    </div>
  )
}

const QuizCarousel = () => {
  const [curr, setCurr] = useState(0)
  const [userPoint, setUserPoint] = useState(0)
  const [answersStatus, setAnswersStatus] = useState<AnswerStatus[]>([])
  const [currentCorrectAnswer, setCurrentCorrectAnswer] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hintLifeLine, setHintLifeLine] = useState(0)
  const [fiftyFiftyLifeLine, setFiftyFiftyLifeLine] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [hiddenLettersByIndex, setHiddenLettersByIndex] = useState<HiddenLettersByIndex>({})

  const carouselRef = useRef<HTMLDivElement | null>(null)
  const { user, isReady } = useAuth()
  const navigate = useRouter()
  const { setEventType, setStartGame } = useGameStore()

  const { data: quizData, isLoading } = useQuery({
    queryKey: ['quizMaster'],
    queryFn: async () => {
      return await axios.get(`/api/quiz`, { params: { userId: user?.id } })
    },
    staleTime: Infinity,
    enabled: Boolean(user?.id),
  })

  const questions: QuizQuestion[] = quizData?.data?.questions || []
  const totalQuestions = quizData?.data?.totalQuestions || questions.length
  const scorePerCorrect = quizData?.data?.scorePerCorrectAnswer || 10
  const currentQuestion = questions[curr]
  const currentHiddenLetters = useMemo(() => hiddenLettersByIndex[curr] || [], [hiddenLettersByIndex, curr])

  const next = () => setCurr((current) => (current === totalQuestions - 1 ? current : current + 1))
  const openDialog = (id: string) => {
    const dialog = document.getElementById(id) as HTMLDialogElement | null
    dialog?.showModal()
  }

  const mutation = useMutation({
    mutationFn: async (payload: { id: number; jawaban?: string; lifeline?: string; userId?: string }) => {
      return await axios.post(
        `/api/quiz`,
        {
          id: payload.id,
          jawaban: payload.jawaban,
          lifeline: payload.lifeline,
          userId: payload.userId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    },
  })

  useEffect(() => {
    if (!questions.length) return
    setAnswersStatus(Array(questions.length).fill(null))
    setUserPoint(quizData?.data?.playerScore || 0)
    setHintLifeLine(quizData?.data?.hintLifeLine ?? 0)
    setFiftyFiftyLifeLine(quizData?.data?.fiftyFiftyLifeLine ?? 0)
  }, [
    questions.length,
    quizData?.data?.playerScore,
    quizData?.data?.hintLifeLine,
    quizData?.data?.fiftyFiftyLifeLine,
  ])

  if (!isReady) {
    return <Loading />
  }

  if (!user) {
    redirect('/sign-in')
  }

  if (quizData?.data?.gameOver === true) {
    return <QuizGameScorePage />
  }

  const handleAnswer = async ({
    id,
    letter,
    index,
    options,
  }: {
    id: number
    letter: string
    index: number
    options: Array<{ letter: string; label: string }>
  }) => {
    try {
      setIsSubmitting(true)
      const response = await mutation.mutateAsync({
        id,
        jawaban: letter,
        userId: user?.id ? String(user.id) : undefined,
      })
      const isCorrect = response.data.isCorrect
      const correctLetter = response.data.answer
      const correctOption = options.find((option) => option.letter === correctLetter)
      setCurrentCorrectAnswer(correctOption?.label || '')

      setUserPoint((point) => (isCorrect ? point + Number(scorePerCorrect) : point))
      setAnswersStatus((status) => {
        const newStatus = [...status]
        newStatus[index] = isCorrect
        return newStatus
      })

      const isLast = index === totalQuestions - 1
      if (isLast) {
        isCorrect ? openDialog('modal_correct_last_answer') : openDialog('modal_incorrect_last_answer')
      } else {
        isCorrect ? openDialog('modal_correct_answer') : openDialog('modal_incorrect_answer')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFiftyFiftyLifeLine = async () => {
    if (!currentQuestion || fiftyFiftyLifeLine === 0) return
    const response = await mutation.mutateAsync({
      id: currentQuestion.id,
      lifeline: 'fifty-fifty',
      userId: user?.id ? String(user.id) : undefined,
    })
    if (Array.isArray(response.data?.letters)) {
      setHiddenLettersByIndex((prev) => ({
        ...prev,
        [curr]: response.data.letters,
      }))
    }
    setFiftyFiftyLifeLine((prev) => Math.max(0, prev - 1))
  }

  const handleHintLifeLine = async () => {
    if (!currentQuestion || hintLifeLine === 0) return
    setShowModal(true)
    await mutation.mutateAsync({
      id: currentQuestion.id,
      lifeline: 'hint',
      userId: user?.id ? String(user.id) : undefined,
    })
    setHintLifeLine((prev) => Math.max(0, prev - 1))
  }

  const DIALOG_LIST = [
    {
      id: 'modal_correct_last_answer',
      title: 'Benar',
      icon: '/images/correct.png',
      btnTitle: 'Lanjut',
      onClickButton: () => openDialog('modal_total_point'),
    },
    {
      id: 'modal_correct_answer',
      title: 'Benar',
      icon: '/images/correct.png',
      btnTitle: 'Lanjut',
      onClickButton: next,
    },
    {
      id: 'modal_incorrect_last_answer',
      title: 'Salah',
      icon: '/images/incorrect.png',
      btnTitle: 'Lanjut',
      onClickButton: () => openDialog('modal_total_point'),
    },
    {
      id: 'modal_incorrect_answer',
      title: 'Salah',
      icon: '/images/incorrect.png',
      btnTitle: 'Lanjut',
      onClickButton: next,
    },
    {
      id: 'modal_total_point',
    },
  ]

  return (
    <div ref={carouselRef} className="overflow-hidden relative bg-primary-darker min-h-screen">
      <BackIcon
        iconColor="white"
        className="absolute left-2 top-5 z-10"
        onClick={() => {
          setEventType('none')
          setStartGame(true)
          navigate.push('/play')
        }}
      />
      <QuizHintModal
        showModal={showModal}
        closeModal={() => {
          setShowModal(false)
        }}
        link={currentQuestion?.link || ''}
      />
      {isLoading && <Loading />}
      {!isLoading && questions.length > 0 && (
        <div
          style={{
            display: 'flex',
            transition: 'transform 0.5s ease-out',
            transform: `translateX(-${curr * 100}%)`,
          }}
        >
          {questions.map((question, index) => (
            <QuizSlides
              key={question.id}
              quizIndex={index}
              title="Mini Kuis"
              question={question}
              lastQuestion={index === totalQuestions - 1}
              answersStatus={answersStatus}
              hiddenLetters={index === curr ? currentHiddenLetters : []}
              hintLifeLine={hintLifeLine}
              fiftyFiftyLifeLine={fiftyFiftyLifeLine}
              onHint={handleHintLifeLine}
              onFiftyFifty={handleFiftyFiftyLifeLine}
              onAnswer={handleAnswer}
              isSubmitting={isSubmitting}
            />
          ))}
        </div>
      )}

      {DIALOG_LIST.map((dialog) => (
        <dialog key={dialog.id} id={dialog.id} className="modal bg-black/80">
          {dialog.id === 'modal_total_point' ? (
          <div className="flex flex-col gap-8 justify-center items-center text-white text-xl px-10">
            <p>Kamu mendapatkan</p>
            <QuizPaginationGrid answersStatus={answersStatus} />
            <div className="bg-cream text-primary-brass rounded-2xl pt-0 px-10 pb-2 font-bold text-2xl">
              {userPoint}
            </div>
            <p>point</p>
            <p className="text-sm text-center">
              Jelajahi karya dan jawab dengan benar pertanyaan dalam mini kuis pada karya lainnya
              untuk mendapatkan poin lebih banyak
            </p>

              <button
                className="bg-primary-darker flex items-center justify-center text-lg border border-primary-brass rounded-xl px-5 py-3 w-3/4 text-white"
                onClick={() => {
                  setEventType('none')
                  setStartGame(true)
                  navigate.push('/play')
                }}
              >
                <svg className="w-8 h-8" viewBox="0 0 257 257" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1.21191" y="1.0437" width="255" height="255" stroke="none" strokeOpacity="0.1" />
                  <path
                    d="M90.3558 122.815C86.7055 126.466 86.7055 132.384 90.3558 136.034L138.165 183.844C140.355 186.034 143.906 186.034 146.097 183.844C148.287 181.654 148.287 178.103 146.097 175.912L105.358 135.174C101.453 131.269 101.453 124.937 105.358 121.032L146.317 80.0733C148.142 78.2481 148.142 75.2889 146.317 73.4637C144.492 71.6385 141.533 71.6385 139.707 73.4637L91.6777 121.493L90.3558 122.815Z"
                    fill="currentColor"
                  />
                </svg>
                <span>Kembali ke permainan</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5 justify-center items-center">
              {dialog.icon && (
                <Image src={dialog.icon} alt="icon" width={220} height={220} className="w-3/5 h-auto" />
              )}
              <div className="space-y-3">
                <p className="text-4xl font-bold text-center text-white">Jawabanmu</p>
                <p className="text-5xl font-bold text-center text-white">{dialog.title}</p>
              </div>

              <div className="space-y-3 flex flex-col items-center m-3 w-4/5">
                {dialog.title === 'Salah' && (
                  <p className="text-2xl text-center text-white">Jawaban yang benar</p>
                )}
                <div className="bg-correct rounded-xl text-white py-3 px-12 w-full text-center text-xl">
                  {currentCorrectAnswer}
                </div>
              </div>

              <form method="dialog">
                <button
                  className="bg-primary-orange text-white rounded-xl px-12 py-3"
                  onClick={dialog.onClickButton}
                >
                  {dialog.btnTitle}
                </button>
              </form>
            </div>
          )}
        </dialog>
      ))}
    </div>
  )
}

export default QuizCarousel
