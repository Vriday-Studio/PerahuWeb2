'use client'
import Button from '@/components/Button'
import { Container } from '@/components/Container'
import AvatarPlayer from '@/components/avatar/AvatarPlayer'
import GameMaster from '@/components/game/master'
import React, { useEffect, useState } from 'react'

import Loading from '@/components/Loading'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { database } from '@/app/firebase'
import { ref, get, set, onValue, off } from 'firebase/database'

import { useGameStore } from '@/store/game'
import { useUserStore } from '@/store/user'
import { redirect } from 'next/navigation'
import WaitingPage from '@/components/game/waiting'
import GameScore from '@/components/game/score'

import _debounce from 'lodash/debounce'

type PlayerEntry = {
  id?: string | number
  skor?: string | number
  gotItem?: string
  lastItem?: string
  ready?: string
}

const TreasureGame = () => {
  const router = useRouter()
  const [jumlahPlayer, setJumlahPlayer] = useState(0)
  const [waitingTime, setWaitingTime] = useState(30)
  const [maxPlayer, setMaxPlayer] = useState(4)
  let jumPlayerlet=0
  let jumPlayerlastgame=0
  const [totalScore, setTotalScore] = useState(0)
  const [hasRecordedTreasurePoints, setHasRecordedTreasurePoints] = useState(false)
  let datastates='ready'
  const { user, isReady } = useAuth()

  const {
    eventType,
    setEventType,
    _isTimeWait,
    setTimeWait,
    setTreasureHuntStatus,
    _treasureHuntStatus,
    setStartGame,
  } = useGameStore()

  const { userData } = useUserStore()


  const ensureTreasurePlayerSlot = async (currentCount: number) => {
    if (!userData?.userID) return
    const playersSnap = await get(ref(database, 'count/Treasure/Player'))
    let players: Record<string, PlayerEntry> = {}
    if (playersSnap.exists()) {
      players = playersSnap.val()
    }

    const existingSlot = Object.keys(players).find(
      (key) => Number(players[key]?.id) === Number(userData.userID)
    )
    if (existingSlot) return

    const emptySlot = [1, 2, 3, 4].find((slot) => {
      const entry = players[slot]
      return !entry || entry.id === '-1' || entry.id === 0 || entry.id === '0'
    })

    if (!emptySlot) return

    await set(ref(database, `count/Treasure/Player/${emptySlot}/`), {
      gotItem: 'no',
      id: userData.userID,
      lastItem: 'none',
      skor: '0',
      ready: 'no',
    })

    const nextCount = Math.min(maxPlayer, currentCount + 1)
    await set(ref(database, 'count/Treasure/JumlahPlayer/'), { jumlah: nextCount.toString() })
    setJumlahPlayer(nextCount)
  }

  const handleCheckPlayer = () => {
    get(ref(database, 'count/Treasure/state/state/')).then((snapshot) => {
      if (snapshot.exists()) {
         datastates = snapshot.val()
      console.log("datastate="+datastates)
      }
    })
 
 console.log('status _treasureHuntStatus='+_treasureHuntStatus)
    
      get(ref(database, 'count/Treasure/JumlahPlayer/jumlah')).then((snapshot) => {
        if (snapshot.exists()) {
          const textvalue = parseInt(snapshot.val())
          let valuelet=textvalue
          jumPlayerlet=textvalue
          if(valuelet <0){
            valuelet=0
            set(ref(database, 'count/Treasure/JumlahPlayer/jumlah'), {
              jumlah: '0',
            })
          }
          
       
          //   router.push('/')
          // } else
         //   //console.log('jumlah='+valuelet)
          if (valuelet === maxPlayer && _treasureHuntStatus !== 'ingame' && datastates !== 'over') {
            setTimeWait(false)
  
            console.log("player udh max wait max waktu 0")
           
          //  jumPlayerlastgame=2
       //  })
         set(ref(database, 'count/Treasure/JumlahPlayer/'), { jumlah: maxPlayer.toString() }).then(() => {
          setJumlahPlayer(maxPlayer)
        })
        set(ref(database, 'count/Treasure/isInit/'), { isInit: 'true' })
        set(ref(database, 'count/Treasure/Status/'), { stats: 'wait' })
        set(ref(database, 'count/Treasure/StatTime/'), { timewait: '0' })
        jumPlayerlet=maxPlayer
          } else
          if(waitingTime<=0 &&  _treasureHuntStatus !== 'ingame' && datastates !== 'over'){
    
       console.log("player udh 1 wait max waktu 0")
        //  })
               // setWaitingTime(0);
                if (valuelet === maxPlayer) {
                 console.log("player udh max wait max waktu 0")
                  jumPlayerlet=maxPlayer
             
                } else{
                  //console.log("player udh 1 wait 0")
                  jumPlayerlet=1
                 // jumPlayerlastgame=1
                }
               // closeFinish=true;
               console.log("waktu wait habis masuk ingame")
                setTimeWait(false)
                
          }else
          if (waitingTime>=1 && valuelet === 0 && _treasureHuntStatus !== 'ingame'  && _treasureHuntStatus !== 'finish' && datastates !== 'over') {
            set(ref(database, 'count/Treasure/isInit/'), { isInit: 'true' })
          set(ref(database, 'count/Treasure/StatTime/'), { timewait: '30' })
          set(ref(database, 'count/Treasure/Status/'), { stats: 'wait' }).then(() => {
            setTreasureHuntStatus('wait')
           })
            set(ref(database, 'count/Treasure/JumlahPlayer/'), { jumlah: '1' }).then(() => {
              setJumlahPlayer(1)
            })
            setTimeWait(true)

            set(ref(database, 'count/Treasure/Player/1/'), {
              gotItem: 'no',
              id: userData.userID,
              lastItem: 'none',
              skor: '0',
              ready: 'no',
            }).then(() => {
              set(ref(database, 'count/Treasure/JumlahPlayer/'), { jumlah: '1' }).then(() => {
                jumPlayerlet=1
                console.log("val 0 jumlahplayer="+jumPlayerlet)
              })
            })
            set(ref(database, 'count/Treasure/Player/2/'), {
              gotItem: 'no',
              id: '-1',
              lastItem: 'none',
              skor: '0',
              ready: 'no',
            })
            set(ref(database, 'count/Treasure/Player/3/'), {
              gotItem: 'no',
              id: '-1',
              lastItem: 'none',
              skor: '0',
              ready: 'no',
            })
            set(ref(database, 'count/Treasure/Player/4/'), {
              gotItem: 'no',
              id: '-1',
              lastItem: 'none',
              skor: '0',
              ready: 'no',
            })

          } else if (valuelet >= 1 && valuelet < maxPlayer && _treasureHuntStatus !== 'ingame' && datastates !== 'over') {
            console.log("ini player kedua cek")
            setTimeWait(true)
            set(ref(database, 'count/Treasure/isInit/'), { isInit: 'true' })
            set(ref(database, 'count/Treasure/Status/'), { stats: 'wait' }).then(() => {
              setTreasureHuntStatus('wait')
            })
            ensureTreasurePlayerSlot(valuelet)
          
            ////console.log(userData.userID)
            
            
          }
      //  }
        }
      })
    
  }

const handlecloseTreasureHuntGame = async () => {
console.log('handleclosecount')
set(ref(database, 'count/Treasure/Status/'), { stats: 'none' }).then(() => {
  setTreasureHuntStatus('none')
 })
setWaitingTime(30)
setEventType('none')
set(ref(database, 'count/Treasure/state/'), { state: 'ready' })
  await get(ref(database, 'count/Treasure/handleclose/handle/')).then(async (snapshot) => {
    if (snapshot.exists()) {
      const countclose = parseInt(snapshot.val())
      let countplus=countclose+1
     console.log('countplus='+countplus)
      await set(ref(database, 'count/Treasure/handleclose/'), { handle: countplus.toString() }).then(() => {
        console.log('jumPlayerlastgame countplus='+jumPlayerlet)
        if(jumPlayerlet===1){
          countplus =2;
        }
      if(countplus>1){
        handleEndTreasureHuntGame()
      }else{
        if(jumPlayerlet===1){
          handleEndTreasureHuntGame()
        }
       
       
        setStartGame(true)
        router.push('/play')
        jumPlayerlet=0
        set(ref(database, 'count/Treasure/JumlahPlayer/jumlah'), {
          jumlah: '0',
        })
      }
   
    })
    }
  }
    )
}
  const handleEndTreasureHuntGame = async () => {
    console.log('closePlayer2count')
    set(ref(database, 'count/Treasure/JumlahPlayer/'), {
      jumlah: '0',
    })
   set(ref(database, 'count/Treasure/state/'), { state: 'ready' })
   set(ref(database, 'count/Treasure/isInit/'), {
      isInit: 'false',
    })
   set(ref(database, 'count/Treasure/handleclose/'), { handle: '0' })
    jumPlayerlet=0
    
    await get(ref(database, 'count/Treasure/Player')).then(async (snapshot) => {
      if (snapshot.exists()) {
        const arrVal = snapshot.val()
        arrVal.filter(async (item: any, index: any) => {
          if (item?.id === userData.userID) {
            await set(ref(database, 'count/Treasure/Player/' + index), {
              gotItem: 'no',
              id: 0,
              lastItem: 'none',
              skor: '0',
              ready: 'no',
            }).then(async () => {
              await get(ref(database, 'count/Treasure/JumlahPlayer/jumlah')).then(
                async (snapshot) => {
                  if (snapshot.exists()) {
                    const val = parseInt(snapshot.val())
                    let valmin =val-1
                    if(valmin <0 ){
                      valmin=0
                    }
                    set(ref(database, 'count/Treasure/JumlahPlayer/'), {
                      jumlah: valmin.toString(),
                    }).then(() => {
                      get(ref(database, 'count/Treasure/JumlahPlayer/jumlah')).then(
                        async (snapshot) => {
                          if (snapshot.exists()) {
                            const val = parseInt(snapshot.val())
                          
                            if (val === 0) {
                              // if jumlah is zero reset the state
                             
                            }
                          }
                        }
                      )
                    })
                  }
                }
              )
            })
          }
        })
      }
    })
   setTreasureHuntStatus('none')
   setEventType('none')
    setStartGame(true)
    router.push('/play')
    jumPlayerlet=0
  
  }

  const handleCheckScore = () => {
    for (let i = 0; i < 5; i++) {
      get(ref(database, 'count/Treasure/Player/' + i + '/id')).then((snapshot) => {
        if (snapshot.exists()) {
          const playerID = parseInt(snapshot.val())
          if (playerID === userData.userID) {
            get(ref(database, 'count/Treasure/Player/' + i + '/skor')).then((snapshot) => {
              if (snapshot.exists()) {
                const rawScore = Number(snapshot.val() || 0)
                const normalized = rawScore > 99 ? Math.floor(rawScore / 10) : rawScore
                const cappedScore = Math.min(normalized, 200)
                setTotalScore(cappedScore)
                if (cappedScore >= 200 && _treasureHuntStatus !== 'finish') {
                  set(ref(database, 'count/Treasure/Status/'), { stats: 'finish' })
                  setTreasureHuntStatus('finish')
                }
              }
            })
          }
        }
      })
    }
  }

  const recordTreasurePoints = async () => {
    if (!userData?.userID) return
    const playerSnapshot = await get(ref(database, 'count/Treasure/Player'))
    if (!playerSnapshot.exists()) return

    const players = Object.values(playerSnapshot.val() || {}) as PlayerEntry[]
    const playerEntry = players.find((item: PlayerEntry) => Number(item?.id) === Number(userData.userID))
    const rawScore = Number(playerEntry?.skor ?? 0)
    const normalized = rawScore > 99 ? Math.floor(rawScore / 10) : rawScore
    const treasurePoints = Math.min(normalized, 200)

    const userPointsRef = ref(database, `Users/${userData.userID}/points`)
    const userTreasurePointsRef = ref(database, `Users/${userData.userID}/treasurePoints`)

    const [pointsSnap, treasureSnap] = await Promise.all([get(userPointsRef), get(userTreasurePointsRef)])
    const currentPoints = Number(pointsSnap.val() || 0)
    const prevTreasure = Number(treasureSnap.val() || 0)

    const nextTreasure = Math.max(prevTreasure, treasurePoints)
    const updatedPoints = Math.max(0, currentPoints - prevTreasure + nextTreasure)
    await Promise.all([
      set(userTreasurePointsRef, nextTreasure),
      set(userPointsRef, updatedPoints),
    ])
  }

  const handleTresureHuntGame = () => {
    if (eventType === 'treasure_hunt') {
     // if (_isTimeWait) {
        get(ref(database, 'count/Treasure/StatTime/timewait')).then((snapshot) => {
          if (snapshot.exists()) {
            setWaitingTime(parseInt(snapshot.val()))

            get(ref(database, 'count/Treasure/JumlahPlayer/jumlah')).then((snapshot) => {
              if (snapshot.exists()) {
                setJumlahPlayer(parseInt(snapshot.val()))
              }
            })

            get(ref(database, 'count/Treasure/Status/stats/')).then((snapshot) => {
              if (snapshot.exists()) {
                const strStats = snapshot.val().toString()
                if (strStats === 'ingame') {
                  setTimeWait(false)
                  setTreasureHuntStatus(strStats)
                }
              }
            })
          }

          handleCheckPlayer()
        })
   
    }
  }

  const handleTreasureHuntStatus = (snapshot: { exists: () => any; val: () => any }) => {
    if (snapshot.exists()) {
     console.log('cloud stat:'+snapshot.val())
      const strStats = snapshot.val()
     
      if (strStats === 'ingame') {
        router.push('/play')
      }
      if (strStats === 'finish' ) {
        set(ref(database, 'count/Treasure/handleclose/'), { handle: '0' })
        setTreasureHuntStatus('finish')
        
     
      }
    }
  }

  const handleTreasurHuntStatusDebounce = _debounce(handleTreasureHuntStatus, 100)

  useEffect(() => {
    const treasureHuntStatusRef = ref(database, 'count/Treasure/Status/stats/')

    if (eventType === 'treasure_hunt') {
      if (!_isTimeWait && _treasureHuntStatus !== 'finish') {
        onValue(treasureHuntStatusRef, handleTreasurHuntStatusDebounce)
      }
    }

    return () => {
      if (eventType === 'treasure_hunt') {
        off(treasureHuntStatusRef, 'value', handleTreasureHuntStatus)
      }
    }
  }, [eventType, _treasureHuntStatus, router])

  useEffect(() => {
    const treasureGame = setInterval(() => {
      handleTresureHuntGame()
      handleCheckScore()
    }, 100)

    return () => {
      clearInterval(treasureGame)
    }
  }, [handleTresureHuntGame, handleCheckScore])

  useEffect(() => {
    if (eventType !== 'treasure_hunt') return
    if (_treasureHuntStatus !== 'finish' || hasRecordedTreasurePoints) return
    setHasRecordedTreasurePoints(true)
    recordTreasurePoints()
  }, [_treasureHuntStatus, eventType, hasRecordedTreasurePoints])

  if (!isReady) {
    return <Loading />
  }

  if (!user) {
    redirect('/sign-in')
  }

  if (_treasureHuntStatus === 'finish' && eventType === 'treasure_hunt') {
    console.log('_treasureHuntStatus === finish && eventType === treasure_hunt')
    return (
      <GameScore
        score={totalScore}
        handleClosedButton={handlecloseTreasureHuntGame}
        showButton={true}
      ></GameScore>
    )
  }
  if (_treasureHuntStatus === 'wait' && eventType === 'treasure_hunt') {
  return (
    <Container>
      <div className="flex justify-center items-center py-20">
      
          <WaitingPage
            totalPlayer={jumlahPlayer}
            waitTime={waitingTime}
            maxPlayer={maxPlayer}
            title="Treasure Hunt"
          />
      </div>
    </Container>
  )
 }

}

export default TreasureGame
