'use client'
import Loading from '@/components/Loading'
import { useAuth } from '@/components/providers/AuthProvider'
import LandingHome from '@/components/landing/LandingHome'
import { redirect, useRouter } from 'next/navigation'
import Button, { ButtonIcon } from '@/components/Button'
import { Joystick } from 'react-joystick-component'
import MenuModal from '@/components/modal/menu'
import { useEffect, useState } from 'react'

import InteractionTab from '@/components/main/InteractionTab'
import { database } from '@/app/firebase'
import { ref, get, update, onValue } from 'firebase/database'
import { useUserStore } from '@/store/user'
import { useGameStore } from '@/store/game'

import StatusToast from '@/components/Status'

import _debounce from 'lodash/debounce'
import { Container } from '@/components/Container'
type TselectedTab = 'Jawaban' | 'Pertanyaan' | 'emoji' | 'Tempat'


export default function Home() {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [selectedTab, setSelectedTab] = useState<TselectedTab>('Pertanyaan')
  const [disabledInterakasiButton, setDisabledInterakasiButton] = useState(false)
  const [idleTimer, setIdleTimer] = useState(0)
  const [isDBLoading, setIsDBLoading] = useState(false)
  const [namaPenjualtx, setNamePenjual] = useState('none')
  const [npcTalkMessage, setNpcTalkMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  let isGuest=false
  // const [openNpcMessage, setOpenNPCMessage] = useState(false)
  const { resetGameStore} = useGameStore()
  let loadingFirst=false
  let eventGameStart=false
  const { user, isReady } = useAuth()

  const isAnonymous = (user as { isAnonymous?: boolean })?.isAnonymous

  const { userData, setUserData, isInitialized, setIsInitialized } = useUserStore()
  const {
    eventType,
    setEventType,
    _isNpcTalk,
    setNpcTalk,
    _treasureHuntStatus,
    startGame,
    setStartGame,
  } = useGameStore()

  const [buttonText, setButtonText] = useState("Interaksi");

  const handleInitializeUser = async () => {
    // initialize User
    console.log("isInitialized1="+ isInitialized)
    if (!isInitialized && !startGame) {
      router.push('/welcome')
      return
    }

    if (isInitialized) {
      return
    }
  
    loadingFirst=true
    if (userData.userID !== null && userData.userID !== undefined) {
      const dbRef = ref(database, 'Antrian/')
      await get(dbRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            // const antrian = snapshot.val()
            const antriup = 'nonewplayer' + ' ' + userData.userID
            update(ref(database, '/'), { Antrian: antriup })
            // console.log(antriup)
          }
        })
        .catch((error) => {
          throw new Error(error)
        })

      resetGameStore()

      

      //update user
      const msgNpcNew = 'true_Mari Menjelajah!_' + userData.Name + '_Ayo Keliling!'
      const dbUserRef = ref(database, 'Users/' + userData.userID)
      await update(dbUserRef, {
        ismove: 'LogOn',
        npcMessage: msgNpcNew,
        isMessage: 'false',
        message: '',
        lastLogin: new Date(),
      })


      //cek false
      const dbfalseRef = ref(database, 'Users/' + userData.userID+'/ismove')
      await get(dbfalseRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const ismoveawal = snapshot.val()
          console.log('ismoveawal='+ismoveawal)
          if (ismoveawal === 'false' || ismoveawal === 'true') {
            loadingFirst=false
          }
          // console.log(antriup)
        }
      })
      .catch((error) => {
        throw new Error(error)
      })

    


      await update(ref(database, '/'), {
        isNewPlayer: 'true_' + userData.userID,
      })

      setIsDBLoading(true)
      setIsInitialized(true)
    }
  }

  const createQueryString = (name = namaPenjualtx, message = npcTalkMessage) => {
    const params = new URLSearchParams()
    params.set('title', name)
    params.set('message', message)

    return params.toString()
  }

  const handleSignOut = async () => {
    const dbUserRef = ref(database, 'Users/' + userData.userID)
    await update(dbUserRef, {
      ismove: 'LogOff',
      moveX: 0,
      moveY: 0,
      lastLogin: new Date(),
      isMessage: 'false',
    })
    setIsInitialized(false)
    setStartGame(false)
    setNamePenjual('none')
    router.push('/welcome')
    // await signOut()
    // resetGameStore()
    // resetUserData()
  }

  const handleGoAvatar = async () => {
    const dbUserRef = ref(database, 'Users/' + userData.userID)
    await update(dbUserRef, {
      ismove: 'LogOff',
      moveX: 0,
      moveY: 0,
      lastLogin: new Date(),
      isMessage: 'false',
    })
    setIsInitialized(false)
    router.push('/avatar')
  }

  const handleSelectedTab = (text: TselectedTab) => {
    return () => setSelectedTab(text)
  }

  const handleMove = (data: any) => {
    setIdleTimer(0)
    const dbUserRef = ref(database, 'Users/' + userData.userID)
    update(dbUserRef, {
      ismove: 'true',
      moveX: -data.x,
      moveY: -data.y,
    })
  }

  const handleJoyStickStart = () => {
    setDisabledInterakasiButton(true)
    if (userData.userID) {
      update(ref(database, 'Users/' + userData.userID), {
        npcMessage: 'false_Dadaah!_Pemusik',
      })
      setNpcTalk(false)
      setNpcTalkMessage('')
      setNamePenjual('none')
    }
  }

  const handleJoyStickStop = () => {
    update(ref(database, 'Users/' + userData.userID), {
      ismove: 'false',
      moveX: 0,
      moveY: 0,
    })
    setDisabledInterakasiButton(true)
    if (userData.userID) {
      update(ref(database, 'Users/' + userData.userID), {
        npcMessage: 'false_Dadaah!_Pemusik',
      })
      get(ref(database, 'Users/' + userData.userID + '/npcMessage')).then((snapshot) => {
        if (!snapshot.exists()) {
          setNpcTalk(false)
          setNpcTalkMessage('')
          setNamePenjual('none')
          setDisabledInterakasiButton(true)
          return
        }
        const parsed = parseNpcMessage(String(snapshot.val()))
        setNpcTalk(parsed.isActive)
        setNpcTalkMessage(parsed.message)
        setNamePenjual(parsed.name)
        setDisabledInterakasiButton(!parsed.isActive)
      })
    }
  }

  // useEffect(() => {
  //   if (status === 'authenticated') {
  //     // redirectByEventType(router, eventType, _isInEvent, _treasureHuntStatus)
  //   }
  // }, [status, eventType, _isInEvent, npcArea])

  const handleUserAction = () => {
    // if (eventType === 'treasure_hunt') {
    //   if (!_isTimeWait) {
    //     get(ref(database, 'count/Treasure/Status/stats/')).then((snapshot) => {
    //       if (snapshot.exists()) {
    //         var strStats = snapshot.val().toString()
    //         setTreasureHuntStatus(strStats)
    //         if (strStats === 'finish') {
    //           setTreasureHuntStatus(strStats)
    //           router.push('/game/treasure-hunt')
    //         }
    //       }
    //     })
    //   }
    // }

    if (idleTimer > 95) {
      //if not is tresure player
      //offline user
    } else {
      //console.log("th stats"+_treasureHuntStatus)
      setIdleTimer(idleTimer + 0.05)

      if (!isDBLoading) {
        const dbUserRef = ref(database, 'Users/' + userData.userID + '/npcMessage')
        get(dbUserRef).then((snapshot) => {
          if (snapshot.exists()) {
            let msgNpcNew = snapshot.val()

            const parsed = parseNpcMessage(String(msgNpcNew))
            setNpcTalk(parsed.isActive)
            if (parsed.isActive) {
              setNpcTalkMessage(parsed.message)
              setNamePenjual(parsed.name)
              setDisabledInterakasiButton(false)
            } else {
              setNpcTalkMessage('')
              setNamePenjual('none')
              setDisabledInterakasiButton(true)
            }
            // console.log(strtrunk[2])
            // area = strtrunk[3]
          } else {
            setNpcTalk(false)
            setNpcTalkMessage('')
            setNamePenjual('none')
            setDisabledInterakasiButton(true)
          }
        })
      } else {
        const dbUserRef = ref(database, 'Users/' + userData.userID + '/ismove')
        get(dbUserRef).then((snapshot) => {
          if (snapshot.exists()) {
            const isMoveReady = snapshot.val()

            if (isMoveReady === 'false') {
              setIsDBLoading(false)
            }
          }
        })
      }
    }
  }

  const handleTreasureHuntStatus = (snapshot: { exists: () => any; val: () => any }) => {
    if (snapshot.exists()) {
      const strStats = snapshot.val().toString()
      if (strStats === 'finish') {
        setIsLoading(true)
        router.replace('/game/treasure-hunt')
      }
    }
  }

  const handleTreasureHuntStatusDebounce = _debounce(handleTreasureHuntStatus, 1000)

  useEffect(() => {
    if (!user) return
    setUserData(user)
  }, [user, setUserData])

  useEffect(() => {
    if (!userData.userID || !startGame) return
    update(ref(database, 'Users/' + userData.userID), {
      ismove: 'false',
      moveX: 0,
      moveY: 0,
      isMessage: 'false',
      npcMessage: 'false_Dadaah!_Pemusik',
    })
    setNpcTalk(false)
    setNpcTalkMessage('')
    setNamePenjual('none')
  }, [userData.userID, startGame])

  useEffect(() => {
    if (!user) return
    if (!startGame) return
    if (isInitialized) return
    handleInitializeUser()
  }, [user, startGame, isInitialized, userData.userID])

  useEffect(() => {
    const treasureHuntStatusRef = ref(database, 'count/Treasure/Status/stats/')

    if (eventType === 'treasure_hunt') {
      onValue(treasureHuntStatusRef, handleTreasureHuntStatusDebounce)
    }
  }, [eventType, _treasureHuntStatus, router])

  useEffect(() => {
    const aksiUser = setInterval(() => {
      handleUserAction()
    }, 50)

    return () => {
      clearInterval(aksiUser)
    }
  }, [handleUserAction])

  if (!isReady) {
    return <Loading />
  }

  if (!user) {
    return <LandingHome />
  }

  function getNpcType(name: string, message: string) {
    const normalized = `${name} ${message}`.toLowerCase()
    if (normalized.includes('treasure') || normalized.includes('harta')) return 'treasure'
    if (normalized.includes('balap') || normalized.includes('karung')) return 'racing'
    if (normalized.includes('quiz')) return 'quiz'
    return 'npc'
  }

  const parseNpcMessage = (raw: string) => {
    if (!raw) {
      return { isActive: false, message: '', name: 'none' }
    }
    if (!raw.includes('_') && raw.includes(',')) {
      const [activePart, ...rest] = raw.split(',')
      return {
        isActive: (activePart || '').toLowerCase().includes('true'),
        message: rest.join(',').trim(),
        name: 'none',
      }
    }
    if (!raw.includes('_')) {
      return { isActive: false, message: '', name: 'none' }
    }
    const parts = raw.split('_')
    const activePart = (parts.shift() || '').toLowerCase()
    const isActive = activePart.includes('true')
    if (parts.length && parts[parts.length - 1] === '') {
      parts.pop()
    }
    const name = (parts.pop() || 'none').trim()
    const message = parts.join('_').trim()
    return {
      isActive,
      message,
      name,
    }
  }

  const confirmNpcInteraction = async () => {
    if (!userData.userID) return null
    const userRef = ref(database, 'Users/' + userData.userID)
    await update(userRef, {
      npcMessage: 'false_Dadaah!_Pemusik',
      ismove: 'Interact',
    })
    await new Promise((resolve) => setTimeout(resolve, 200))
    const snapshot = await get(ref(database, 'Users/' + userData.userID + '/npcMessage'))
    await update(userRef, {
      ismove: 'false',
    })
    if (!snapshot.exists()) return null
    const parsed = parseNpcMessage(String(snapshot.val()))
    if (!parsed.isActive) return null
    return parsed
  }

  const handleInteraksiButton = async () => {
    setIsLoading(true)
    setIdleTimer(0)
    // console.log('nama', namaPenjualtx)
    // console.log('message', npcTalkMessage)

    let currentName = namaPenjualtx
    let currentMessage = npcTalkMessage
    if (userData.userID) {
      const confirmed = await confirmNpcInteraction()
      if (!confirmed) {
        setIsLoading(false)
        return
      }
      setNpcTalk(confirmed.isActive)
      setNpcTalkMessage(confirmed.message)
      setNamePenjual(confirmed.name)
      currentName = confirmed.name
      currentMessage = confirmed.message
      await update(ref(database, 'Users/' + userData.userID), {
        npcMessage: 'false_Dadaah!_Pemusik',
      })
    }

    const npcType = getNpcType(currentName || '', currentMessage || '')

    if(isAnonymous){
      if(npcType === 'treasure'){
      //  setButtonText("Daftar untuk main")
        router.push('/link-with-credential')
      }else if(npcType === 'quiz'){
      //  setButtonText("Daftar untuk main")
        router.push('/link-with-credential')
      }else if(npcType === 'racing'){
       // setButtonText("Daftar untuk main")
        router.push('/link-with-credential')
      } else {
        if (_treasureHuntStatus !== 'ingame' && _treasureHuntStatus !== 'finish') {
          setEventType('none')
        }
        if (userData.Name !== currentName) {
          router.push('/npc' + '?' + createQueryString(currentName, currentMessage))
        }
      }

     
    }else
    if (npcType === 'treasure') {
      setButtonText("Daftar untuk main")
      setEventType('treasure_hunt')
      if (_treasureHuntStatus !== 'ingame' && _treasureHuntStatus !== 'finish') {
       // setIsInitialized(false)
       
        router.push('/intro/treasure-hunt')
      }
    } else if (npcType === 'quiz') {
     // setIsInitialized(false)
     setButtonText("Daftar untuk main")
      setEventType('quiz')
      router.push('/intro/quiz')
    } else if (npcType === 'racing') {
     // setIsInitialized(false)
     setButtonText("Daftar untuk main")
      setEventType('racing')
      router.push('/intro/racing')
    } else {
      setButtonText("Interaksi")
      if (_treasureHuntStatus !== 'ingame' && _treasureHuntStatus !== 'finish') {
        setEventType('none')
      }
      if (userData.Name !== currentName) {
        router.push('/npc' + '?' + createQueryString(currentName, currentMessage))
      }
    }

    setIsLoading(false)
  }

  if (loadingFirst) {
    return <Loading />
  }

  if (idleTimer > 95) {
    return (
      <Container>
        <div className="flex flex-col justify-center items-center gap-5 px-10 h-screen">
          <p className="text-white text-xl">Anda Telah Meninggalkan Permainan</p>
          <Button onClick={() =>router.refresh()} text="Masuk Ulang"></Button>
          <Button onClick={handleSignOut} text="Keluar"></Button>
        </div>
      </Container>
    )
  }

  return (
    <div className="min-h-screen max-w-md m-auto bg-primary-dark text-white">
      <MenuModal
        showModal={showModal}
        closeModal={() => {
          setShowModal(false)
        }}
        onSignOut={handleSignOut}
        onAvatar={handleGoAvatar}
        isGuest={isAnonymous}
      />
      <div className="bg-primary-dark h-3/5 w-full rounded-b-xl relative border-b border-primary-brass">
        <div className="relative flex justify-center items-center">
          <div className="text-center text-white flex justify-center items-center py-5">
            Pilih {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}
          </div>
          <div className="absolute right-5">
            <ButtonIcon
              image_path="/assets/ui/menu/hamburger.svg"
              onClick={() => {
                setShowModal(true)
              }}
            />
          </div>
        </div>
        <div className=" relative h-full w-full pb-20">
          <InteractionTab selected={selectedTab} />
          <div className="flex justify-center items-center gap-2 px-5 py-5 absolute w-full bottom-0">
            <Button
              text="Pertanyaan"
              disabled={selectedTab === 'Pertanyaan'}
              onClick={handleSelectedTab('Pertanyaan')}
            />
            <Button
              text="Jawaban"
              disabled={selectedTab === 'Jawaban'}
              onClick={handleSelectedTab('Jawaban')}
            />
            {/* <Button
              text="Area"
              disabled={selectedTab === 'area'}
              onClick={handleSelectedTab('area')}
            /> */}
            <div>
              <ButtonIcon
                image_path="/assets/icon/face-icon.svg"
                disabled={selectedTab === 'emoji'}
                onClick={handleSelectedTab('emoji')}
              />
             
            </div>
            <div>
            <Button
              text="Tempat"
              disabled={selectedTab === 'Tempat'}
              onClick={handleSelectedTab('Tempat')}
            />
            </div>
          </div>
        </div>
      </div>
      {_treasureHuntStatus === 'ingame' && (
        <div className="flex justify-end w-full">
          <StatusToast />
        </div>
      )}
      <div className="relative mt-20 w-full max-w-md m-auto">
        <div className="flex justify-center items-center mb-5">
          <div className="relative">
            <Joystick
              size={200}
              stickSize={75}
              baseColor={'#E2C088'}
              stickColor={'#B0803D'}
              move={handleMove}
              stop={handleJoyStickStop}
              start={handleJoyStickStart}
            ></Joystick>
            <span className="absolute left-1/2 -translate-x-1/2 -top-4 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-soft-cream opacity-80"></span>
            <span className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-soft-cream opacity-80"></span>
            <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[12px] border-r-soft-cream opacity-80"></span>
            <span className="absolute -right-4 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[12px] border-l-soft-cream opacity-80"></span>
          </div>
        </div>
        <div className="px-5 pb-2 h-20" >
          {isAnonymous && (_treasureHuntStatus !== 'ingame') &&( 
            <Button
              text={buttonText}
              disabled={disabledInterakasiButton || !_isNpcTalk}
              onClick={handleInteraksiButton}
              isLoading={isLoading}
             // onClick={() => router.push('/link-with-credential')}
            />
          )}
          {!isAnonymous && (_treasureHuntStatus !== 'ingame') && (
            <Button
              text={buttonText}
              disabled={disabledInterakasiButton || !_isNpcTalk}
              onClick={handleInteraksiButton}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  )
}

Home.requireAuth = true
