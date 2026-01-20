import { database, auth } from '@/app/firebase'
import { equalTo, get, orderByChild, query, ref, update } from 'firebase/database'
import { NextResponse } from 'next/server'

import { Session, getServerSession } from 'next-auth'
import generateRandomNumbers from '@/utils/randomizer'
import { authOptions } from '@/lib/authOptions'

const scorePerCorrectAnswer: number = 20
const totalQuestions = 10

const generateRandomQuestion = async () => {
  const dbRef = ref(database, `count/Quiz/soal`)
  const snapshot = await get(dbRef)
  if (snapshot.exists()) {
    const data: any[] = snapshot.val()
    // delete data.jawaban
    //add id in Array
    // const dataWithId = data.map((obj: any, index: number) => ({ ...obj, id: index }))
    const dataWithoutJawaban = data.map(({ jawaban, ...rest }) => rest)

    // Add id in Array
    const dataWithId = dataWithoutJawaban.map((obj, index) => ({ ...obj, id: index }))

    return generateRandomNumbers(1, data.length - 1)
      .map((index) => dataWithId[index])
      .slice(0, totalQuestions)
  } else {
    return NextResponse.json({ message: 'Data not found' })
  }
}

const getUserQuizState = async (userId: any) => {
  const userQuizStateRef = ref(database, `Users/${userId}/quizState`)
  const userStateSnapshot = await get(userQuizStateRef)

  if (userStateSnapshot.exists()) {
    return userStateSnapshot.val()
  } else {
    // generate the question
    const questions = await generateRandomQuestion()

    // Initialize quiz state for the user
    const initialUserQuizState = {
      randomQuestion: questions,
      currentQuestionNumber: 1,
      playerTotalScore: 0,
      fiftyFiftyLifeLine: 1,
      hintLifeLine: 3,
      isQuestionsLoaded: true,
      gameOver: false,
    }

    await update(userQuizStateRef, initialUserQuizState)
    return initialUserQuizState
  }
}

const getUserID = async (session: any) => {
  if (session?.user.email) {
    const usersRef = ref(database, 'Users')
    const emailQuery = query(usersRef, orderByChild('Email'), equalTo(session.user.email))
    const snapshot = await get(emailQuery)

    if (snapshot.exists()) {
      const userId = Object.keys(snapshot.val())[0]
      return userId
    } else {
      return null
    }
  } else {
    return null
  }
}

const updateUserQuizState = async (userId: any, userQuizState: object) => {
  const userQuizStateRef = ref(database, `Users/${userId}/quizState`)
  await update(userQuizStateRef, userQuizState)
}

const restartQuizState = async (userId: any) => {
  const questions = await generateRandomQuestion()

  // Initialize quiz state for the user
  const initialUserQuizState = {
    randomQuestion: questions,
    currentQuestionNumber: 1,
    playerTotalScore: 0,
    fiftyFiftyLifeLine: 1,
    hintLifeLine: 3,
    gameOver: false,
  }
  const userQuizStateRef = ref(database, `Users/${userId}/quizState`)
  await update(userQuizStateRef, initialUserQuizState)
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userIdParam = searchParams.get('userId')
  const session = userIdParam ? null : await getServerSession(authOptions)

  if (!userIdParam && (!session || !session.user)) {
    return NextResponse.json({ message: 'Unauthorized', session: session }, { status: 401 })
  }

  try {
    const userId = userIdParam || (await getUserID(session))
    const userQuizState = await getUserQuizState(userId)

    if (userQuizState.currentQuestionNumber > totalQuestions) {
      await updateUserQuizState(userId, { gameOver: true })

      const userQuizStateRef = ref(database, `Users/${userId}`)
      const userQuizStateSnapshot = await get(userQuizStateRef)

      if (userQuizStateSnapshot.exists()) {
        const userData = userQuizStateSnapshot.val()
        await update(userQuizStateRef, {
          ['quiz/legacy']: userData.quizState.playerTotalScore,
        })

        return NextResponse.json({
          playerScore: userData.quizState.playerTotalScore,
          gameOver: userData.quizState.gameOver,
          user: userData,
        })
      } else {
        return NextResponse.json({
          playerScore: 0,
          gameOver: true,
          message: 'Something went wrong!',
        })
      }
    }

    const newData = userQuizState.randomQuestion[userQuizState.currentQuestionNumber - 1]

    delete newData.jawaban
    let Choicelist = [
      { text: newData.a, letter: 'a' },
      { text: newData.b, letter: 'b' },
      { text: newData.c, letter: 'c' },
      { text: newData.d, letter: 'd' },
    ]

    const questions = userQuizState.randomQuestion.map((question: any, index: number) => ({
      id: question.id,
      soal: question.soal,
      a: question.a,
      b: question.b,
      c: question.c,
      d: question.d,
      link: question.link ?? null,
      questionNo: index + 1,
      point: scorePerCorrectAnswer,
    }))

    return NextResponse.json({
      ...newData,
      choices: Choicelist,
      questionNo: userQuizState.currentQuestionNumber,
      playerScore: userQuizState.playerTotalScore,
      fiftyFiftyLifeLine: userQuizState.fiftyFiftyLifeLine,
      hintLifeLine: userQuizState.hintLifeLine,
      gameOver: userQuizState.gameOver,
      scorePerCorrectAnswer,
      totalQuestions,
      questions,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  const bodyText = await req.text()
  const { id, jawaban, lifeline, reset, userId: userIdParam } = JSON.parse(bodyText)
  const userId = userIdParam || (session ? await getUserID(session) : null)

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized', session: session }, { status: 401 })
  }

  try {
    const userQuizState = await getUserQuizState(userId)

    const dbRef = ref(database, `count/Quiz/soal/${id}`)

    const snapshot = await get(dbRef)

    if (reset) {
      await restartQuizState(userId)
      return NextResponse.json({ message: 'Quiz state reset successfully' })
    }

    if (snapshot.exists()) {
      const data = snapshot.val()
      const answer = data.jawaban

      if (jawaban) {
        await updateUserQuizState(userId, {
          currentQuestionNumber: userQuizState.currentQuestionNumber + 1,
        })

        if (data.jawaban === jawaban) {
          await updateUserQuizState(userId, {
            currentQuestionNumber: userQuizState.currentQuestionNumber + 1,
            playerTotalScore: userQuizState.playerTotalScore + scorePerCorrectAnswer,
          })

          return NextResponse.json({
            answer,
            isCorrect: true,
            playerScore: userQuizState.playerTotalScore,
            fiftyFiftyLifeLine: userQuizState.fiftyFiftyLifeLine,
            hintLifeLine: userQuizState.hintLifeLine,
            gameOver: userQuizState.gameOver,
          })
        }

        return NextResponse.json({
          answer,
          isCorrect: false,
          playerScore: userQuizState.playerTotalScore,
          fiftyFiftyLifeLine: userQuizState.fiftyFiftyLifeLine,
          hintLifeLine: userQuizState.hintLifeLine,
          gameOver: userQuizState.gameOver,
        })
      }

      if (lifeline === 'fifty-fifty' && userQuizState.fiftyFiftyLifeLine !== 0) {
        let lifeLineChoices = [
          { text: data.a, letter: 'a', hidden: answer !== 'a' },
          { text: data.b, letter: 'b', hidden: answer !== 'b' },
          { text: data.c, letter: 'c', hidden: answer !== 'c' },
          { text: data.d, letter: 'd', hidden: answer !== 'd' },
        ]

        const remainingChoices = lifeLineChoices.filter((choice) => choice.letter !== answer)

        const randomIndex1 = Math.floor(Math.random() * remainingChoices.length)
        let randomIndex2 = Math.floor(Math.random() * remainingChoices.length)

        while (randomIndex2 === randomIndex1) {
          randomIndex2 = Math.floor(Math.random() * remainingChoices.length)
        }

        const letter1 = remainingChoices[randomIndex1].letter
        const letter2 = remainingChoices[randomIndex2].letter

        await updateUserQuizState(userId, {
          fiftyFiftyLifeLine: userQuizState.fiftyFiftyLifeLine - 1,
        })
        return NextResponse.json({
          letters: [letter1, letter2],
          fiftyFiftyLifeLine: userQuizState.fiftyFiftyLifeLine,
        })
      } else if (lifeline === 'hint' && userQuizState.hintLifeLine !== 0) {
        await updateUserQuizState(userId, {
          hintLifeLine: userQuizState.hintLifeLine - 1,
        })
        return NextResponse.json({
          message: 'Hint LifeLine consumed',
          hintLifeLine: userQuizState.hintLifeLine,
        })
      } else {
        return NextResponse.json({
          fiftyFiftyLifeLine: userQuizState.fiftyFiftyLifeLine,
          message: 'fifty fifty lifeline consumed',
        })
      }
    } else {
      return NextResponse.json({ message: 'Data not found ' })
    }
  } catch (error) {
    return NextResponse.json({ error: error, message: 'Internal Server Error' })
  }
}
