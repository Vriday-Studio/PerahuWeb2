'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Container } from '@/components/Container'
import Slider from '@/components/game/racing/slider'
import Button from '@/components/Button'
import { Bubble } from '@/components/game/bubble'
import PageHeaderTitle from '@/components/Header'
import Loading from '@/components/Loading'
import { useAuth } from '@/components/providers/AuthProvider'
import { redirect } from 'next/navigation'
import { useUserStore } from '@/store/user'
import { database } from '@/app/firebase'
import { ref, update, get, onValue, set, off } from 'firebase/database'
import { useGameStore } from '@/store/game'
import WaitingPage from '@/components/game/waiting'
import GameScore from '@/components/game/score'
import { useRouter } from 'next/navigation'

type gameStatusProps = 'none' | 'wait' | 'ingame' | 'finish' | 'over'

const RacingGame = () => {
  const router = useRouter()
  const sliderRef = useRef<any>(null)
  const { userData } = useUserStore()
  const [jumlahPlayer, setJumlahPlayer] = useState(0)
 // let jumPlayerlet=0
  const [totalScore, setTotalScore] = useState(0)
  const [waitingTime, setWaitingTime] = useState(30)
  const [maxPlayer, setMaxPlayer] = useState(2)
  const [gameStatus, setGameStatus] = useState<gameStatusProps>('none')
  const [isUnmounted, setIsUnmounted] = useState(false)
  let timerwait=0
  const [playerScore, setPlayerScore] = useState('')
  let  skorPlayerlet=0
  const [indekPlayerlet, setPlayerIndexLet] = useState('0')
  let  jumPlayerlet=0
  let datastates='ready'
  let closeFinish=false
  const [playerPosition, setPlayerPosition] = useState(0)
  const [hasRecordedRacingPoints, setHasRecordedRacingPoints] = useState(false)

  const [stateKarung, setStateKarung] = useState('idle')
  const [comboLompat, setComboLompat] = useState(0)
// Menambahkan state untuk menyimpan timer
  const { setEventType, setStartGame } = useGameStore()
  const [showJumpButton, setShowJumpButton] = useState(true)


  const handleJump = async () => {
    if (sliderRef.current) {
      sliderRef.current?.handleJump()
      setComboLompat(sliderRef.current?.getComboLompat())
      if(gameStatus === 'ingame'){
      console.log("set player ke"+indekPlayerlet+ "//jatuhlompat="+ stateKarung)
        set(ref(database, 'count/BalapKarung/Player/'+indekPlayerlet+'/'), {
              gotItem:stateKarung,
              id:userData.userID,
              skor: '0'
              })
              
              
           
      }
    }
  }

  const { eventType } = useGameStore()

  useEffect(() => {

       const dbUserRef = ref(database, 'Users/' + userData.userID)
   
        update(dbUserRef, {
          isevent: 'bk',
        stateskarung: stateKarung,
         })
         
         if (stateKarung === 'jatuh') {
          console.log("jatuh")
          setShowJumpButton(false)
          const timer = setTimeout(() => {
            setShowJumpButton(true)
          }, 1000)
           // Tunggu 1 detik sebelum menampilkan kembali tombol
          
          return () => clearTimeout(timer)
        }

  }, [stateKarung])

  const { user, isReady } = useAuth()
  
  const handleClosedButton = async () => {
   //console.log("handle close")
   console.log('handleclosecount')
   set(ref(database, 'count/BalapKarung/Status/'), { stats: 'none' }).then(() => {
    setGameStatus('none')
   })
  setWaitingTime(30)
  setEventType('none')
  set(ref(database, 'count/BalapKarung/state/'), { state: 'ready' })
   await get(ref(database, 'count/BalapKarung/handleclose/handle/')).then(async (snapshot) => {
    if (snapshot.exists()) {
      const countclose = parseInt(snapshot.val())
      let countplus=countclose+1
     console.log('countplus='+countplus)
      await set(ref(database, 'count/BalapKarung/handleclose/'), { handle: countplus.toString() }).then(() => {
        console.log('jumPlayerlastgame countplus='+jumPlayerlet)
        if(jumPlayerlet===1){
          countplus =2;
        }
      if(countplus>1){
        handleEndBalap()
      }else{
        if(jumPlayerlet===1){
          handleEndBalap()
        }
       
       
        setStartGame(true)
        router.push('/play')
        jumPlayerlet=0
        set(ref(database, 'count/BalapKarung/JumlahPlayer/jumlah'), {
          jumlah: '0',
        })
      }
   
    })
    }
  }
    )
   //set(ref(database, 'count/BalapKarung/state/'), { state: 'ready' })
    // setIsUnmounted(true)
 
  }
  const handleEndBalap = async (): Promise<void> => {
    console.log('closePlayer2count')
    set(ref(database, 'count/BalapKarung/JumlahPlayer/'), {
      jumlah: '0',
    })
   set(ref(database, 'count/BalapKarung/state/'), { state: 'ready' })
   set(ref(database, 'count/BalapKarung/isInit/'), {
      isInit: 'false',
    })
   set(ref(database, 'count/BalapKarung/handleclose/'), { handle: '0' })
    jumPlayerlet=0
    await get(ref(database, 'count/BalapKarung/Player')).then(async (snapshot) => {
      if (snapshot.exists()) {
        const arrVal = snapshot.val()
        arrVal.filter(async (item: any, index: any) => {
          if (item?.id === userData.userID) {
            await set(ref(database, 'count/BalapKarung/Player/' + index), {
              gotItem: 'no',
              id: 0,
              lastItem: 'none',
              skor: '0',
              ready: 'no',
            }).then(async () => {
              await get(ref(database, 'count/BalapKarung/JumlahPlayer/jumlah')).then(
                async (snapshot) => {
                  if (snapshot.exists()) {
                    const val = parseInt(snapshot.val())
                    let valmin= val-1
                    if(valmin<0){
                      valmin=0
                    }
                    set(ref(database, 'count/BalapKarung/JumlahPlayer/'), {
                      jumlah: (valmin).toString(),
                    }).then(() => {
                      get(ref(database, 'count/BalapKarung/JumlahPlayer/jumlah')).then(
                        async (snapshot) => {
                          if (snapshot.exists()) {
                            const val = parseInt(snapshot.val())
                            if (val === 0) {
                              // if jumlah is zero reset the state
                              await set(ref(database, 'count/BalapKarung/Status/'), {
                                stats: 'none',
                              })
                              await set(ref(database, 'count/BalapKarung/isInit/'), {
                                isInit: 'false',
                              })
                             // closeFinish=false
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
    setGameStatus('none')
    setEventType('none')
    setWaitingTime(30)
    setStartGame(true)
    router.push('/play')
  }


  useEffect(() => {
    const handleJumlahPlayerChange = (snapshot: { exists: () => any; val: () => string }) => {
      if (snapshot.exists()) {
        //jumlahplayer
       let valueJum = parseInt(snapshot.val())
       if (isNaN(valueJum)) {
        valueJum = 0
       }
       jumPlayerlet=valueJum
       setJumlahPlayer(valueJum)

        if(jumlahPlayer <0){
          valueJum =0
          set(ref(database, 'count/BalapKarung/JumlahPlayer/'), {
            jumlah: '0',
          })
         
        }

       
        console.log("snapshot jumlah value="+valueJum)
        get(ref(database, 'count/BalapKarung/state/state/')).then(
          async (snapshot) => {
           if (snapshot.exists()) {
              datastates = snapshot.val()
             console.log("datastate="+datastates)
            //  localStorage.setItem('datastate', datastates)
              if(datastates !== 'over'){ 
              console.log("datastate 182masuk="+datastates)
               if (valueJum >= 1 && valueJum < maxPlayer && gameStatus !== 'ingame') {
                 set(ref(database, 'count/BalapKarung/isInit/'), { isInit: 'true' })
                 set(ref(database, 'count/BalapKarung/Status/'), { stats: 'wait' })
                 setGameStatus('wait')
               }
               if(valueJum ===2 && gameStatus !== 'ingame'){
               console.log('valueJum ===2 && gameStatus !== ingane')
               
               
               set(ref(database, 'count/BalapKarung/JumlahPlayer/'), {
                jumlah: '2',
              }).then(() => {
                setJumlahPlayer(2)
              })
              set(ref(database, 'count/BalapKarung/isInit/'), { isInit: 'true' })
              set(ref(database, 'count/BalapKarung/Status/'), { stats: 'wait' })
              set(ref(database, 'count/BalapKarung/StatTime/'), { timewait: '0' })
                 jumPlayerlet=2
               }else
              if(waitingTime<=0 && gameStatus !== 'ingame'){
                console.log('waitingTime<=0 && && gameStatus !== ingame')
                if (valueJum  === 2) {
                  console.log("player udh 2 wait max waktu 0 valueJum  === 2")
                //  jumPlayerlet=2
                
                
                 
                //  set(ref(database, 'count/BalapKarung/Status/'), { stats: 'wait' })
                //set(ref(database, 'count/BalapKarung/Status/'), { stats: 'ingame' })
                } else{
                  console.log("player udh 1 wait 0")
                  //jumPlayerlet=1

                }
               // closeFinish=true;
                console.log("waktu wait habis masuk ingame")
              
              }else if(valueJum  === 0 && gameStatus !== 'ingame') {
              //  set(ref(database, 'count/BalapKarung/state/'), { state: 'ready' })
                    console.log("isiplayer pertama valueJum  === 0")
                   // closeFinish=true
                 set(ref(database, 'count/BalapKarung/isInit/'), { isInit: 'true' })
                  set(ref(database, 'count/BalapKarung/StatTime/'), { timewait: '30' })
                  set(ref(database, 'count/BalapKarung/Status/'), { stats: 'wait' })
                    
                    set(ref(database, 'count/BalapKarung/Player/1/'), {
                      gotItem: 'no',
                      id: userData.userID,
                    
                      skor: '0',
                      
                    }).then(() => {
                      set(ref(database, 'count/BalapKarung/JumlahPlayer/'), { jumlah: '1' }).then(() => {
                       setJumlahPlayer(1)
                        set(ref(database, 'count/BalapKarung/JumlahPlayer/'), {
                          jumlah: '1',
                        })
                       // jumPlayerlet=1
                      //  setJumlahPlayer(1)
                       setPlayerIndexLet('1')
                    //  ////console.log("val 0 jumlahplayer="+jumPlayerlet)
                        })
                     }
                    )
                 
                      set(ref(database, 'count/BalapKarung/Player/2/'), {
                        gotItem: 'no',
                        id: userData.userID,
                       
                        skor: '0',
                        
                      })
                    
                  } else
                  if (valueJum === 1 && gameStatus !== 'ingame'){
                    //closeFinish=true
                    console.log("ini player kedua cek jumlahPlayer === 1 &&")
                    get(ref(database, 'count/BalapKarung/Player/1/id/')).then(
                      async (snapshot) => {
                        if (snapshot.exists()) {
                          const valx = parseInt(snapshot.val())
                         // const idcon=parseInt(userData.userID)
          
                       //   //console.log("exist valx ="+valx+"//userid"+idcon)
                          if(userData.userID !== valx){
                     //cek kalo beda id jd plyer 2
                      console.log("beda id add id")
                      set(ref(database, 'count/BalapKarung/Player/2/'), {
                        gotItem: 'no',
                        id: userData.userID,
                        skor: '0',
                      
                      })
                     
                      //set(ref(database, 'count/BalapKarung/isInit/'), { isInit: 'true' })
                     // set(ref(database, 'count/BalapKarung/Status/'), { stats: 'wait' })
                      set(ref(database, 'count/BalapKarung/JumlahPlayer/'), { jumlah: '2' }).then(() => {
                      //  setWaitingTime(1);
             
                   //   jumPlayerlet=2
                   setJumlahPlayer(2)
                   set(ref(database, 'count/BalapKarung/JumlahPlayer/'), {
                    jumlah: '2',
                  })
                      setPlayerIndexLet('2')
         console.log("val 0 jumlahplayer="+jumPlayerlet)
                })
          
                    }
                          
                        }})
                    
                   
                  }
                  /*else  if (jumlahPlayer === 2 && gameStatus !== 'ingame'){
                    setPlayerIndexLet('2')
                  }*/

            }else if(datastates === 'over'){
              get(ref(database, 'count/BalapKarung/p'+indekPlayerlet+'skor/skor/')).then(
                async (snapshot) => {
                  if (snapshot.exists()) {
                    const juaraz = parseInt(snapshot.val())
                    skorPlayerlet=juaraz
                    localStorage.setItem('playerScore', snapshot.val())
                   console.log("skor val juara="+skorPlayerlet)
                  
                  }
                }
              )
            }

          }
          }
          )
   // if(closeFinish){
    //  closeFinish=true
     // set(ref(database, 'count/BalapKarung/isInit/'), { isInit: 'true' })
     // set(ref(database, 'count/BalapKarung/Status/'), { stats: 'wait' })
    
       // }
      }
    }
   
    const handleStatusChange = (snapshot: { exists: () => any; val: () => any }) => {
      if (snapshot.exists()) {
        const status = snapshot.val()
        setGameStatus(status)
      console.log("-status="+status)
       
        if(jumlahPlayer === 1){
          skorPlayerlet=1
          localStorage.setItem('playerScore', '1')
          ////console.log("-1skor playerScore="+skorPlayerlet)
        }else if (gameStatus !== 'none') {

         console.log("masuk count/BalapKarung/Player/="+ indekPlayerlet+ "/skor")
          get (ref(database, 'count/BalapKarung/p'+indekPlayerlet+'skor/skor/')).then ((snapshot) => {
            if (snapshot.exists()) {
              ////console.log("count/BalapKarung/Player/="+snapshot.val())
             
              if(snapshot.val() !== '0'){
               // const ids = parseInt(snapshot.val())
              //  skorPlayerlet=ids
                localStorage.setItem('playerScore', snapshot.val())
               console.log("-2skor playerScore="+snapshot.val())
              }
             
  
            
            }
          })
        }
      
        
        


    
        ////console.log("-status="+status)

      }
    }

    const handleStartTimeWaitChange = (snapshot: { exists: () => any; val: () => any }) => {
      if (snapshot.exists()) {
        const time = parseInt(snapshot.val())
        setWaitingTime(time)
       
       ////console.log("timer="+time)
      }
    }
    
    const handlePlayerScoreChange = (snapshot: { exists: () => any; val: () => any }) => {
      if (snapshot.exists()) {
       
        ////console.log("PlayerScore1 ="+snapshot.val())
          setPlayerScore(snapshot.val())
          ////console.log("PlayerScore2 ="+playerScore)
      
        setTotalScore(parseInt(snapshot.val()))
      
      
        
      }
    }

    const jumlahPlayerRef = ref(database, 'count/BalapKarung/JumlahPlayer/jumlah')
    const statusRef = ref(database, 'count/BalapKarung/Status/stats')
    const startTimeWaitRef = ref(database, 'count/BalapKarung/StatTime/timewait')
    const checkPlayerScoreRef = ref(database, 'count/BalapKarung/Player/p'+indekPlayerlet+'skor/skor/')

    if (eventType === 'racing') {
      onValue(jumlahPlayerRef, handleJumlahPlayerChange)
      onValue(statusRef, handleStatusChange)
    onValue(checkPlayerScoreRef, handlePlayerScoreChange)
      onValue(startTimeWaitRef, handleStartTimeWaitChange)
   
    }

    return () => {
      if (eventType === 'racing') {
        off(jumlahPlayerRef, 'value', handleJumlahPlayerChange)
        off(statusRef, 'value', handleStatusChange)
     off(checkPlayerScoreRef, 'value', handlePlayerScoreChange)
        off(startTimeWaitRef, 'value', handleStartTimeWaitChange)
     
        
      }
    }
  }, [eventType])

  const recordRacingPoints = async () => {
    if (!userData?.userID) return
    let playerIndex = indekPlayerlet && indekPlayerlet !== '0' ? indekPlayerlet : '1'
    const playersSnap = await get(ref(database, 'count/BalapKarung/Player'))
    if (playersSnap.exists()) {
      const players = playersSnap.val()
      const matchedIndex = Object.keys(players).find(
        (key) => Number(players[key]?.id) === Number(userData.userID)
      )
      if (matchedIndex) {
        playerIndex = matchedIndex
      }
    }
    const scoreSnap = await get(ref(database, `count/BalapKarung/p${playerIndex}skor/skor/`))
    const rawScore = Number(scoreSnap.val() || 0)
    const racingPoints = rawScore >= 2 ? 20 : rawScore >= 1 ? 10 : 0

    const userPointsRef = ref(database, `Users/${userData.userID}/points`)
    const userRacingPointsRef = ref(database, `Users/${userData.userID}/racingPoints`)

    const [pointsSnap, racingSnap] = await Promise.all([get(userPointsRef), get(userRacingPointsRef)])
    const currentPoints = Number(pointsSnap.val() || 0)
    const prevRacing = Number(racingSnap.val() || 0)

    const nextRacing = Math.max(prevRacing, racingPoints)
    const updatedPoints = Math.max(0, currentPoints - prevRacing + nextRacing)

    await Promise.all([
      set(userRacingPointsRef, nextRacing),
      set(userPointsRef, updatedPoints),
    ])
  }

  useEffect(() => {
    if (gameStatus !== 'finish' || hasRecordedRacingPoints) return
    setHasRecordedRacingPoints(true)
    recordRacingPoints()
  }, [gameStatus, hasRecordedRacingPoints])

  if (!isReady) {
    return <Loading />
  }

  if (!user) {
    redirect('/sign-in')
  }

 //playerScore !== 'NaN' && playerScore !== '' && playerScore !== '0'&& gameStatus === 'finish'

    
 if (gameStatus === 'finish') {
  //let skorfinal= Number(skorPlayerlet)
  get(ref(database, 'count/BalapKarung/p'+indekPlayerlet+'skor/skor/')).then(
    async (snapshot) => {
      if (snapshot.exists()) {
        const juaraz = parseInt(snapshot.val())
        skorPlayerlet=juaraz
        localStorage.setItem('playerScore', snapshot.val())
       console.log("skor val juara="+skorPlayerlet)
      
      }
    }
  )
  console.log("skor final="+skorPlayerlet)
  const racingPointsDisplay = skorPlayerlet >= 2 ? 20 : skorPlayerlet >= 1 ? 10 : 0
   return (

     <GameScore
     
      // score={totalScore}
      
       score={skorPlayerlet}
       points={racingPointsDisplay}
       isJuara={true}
       handleClosedButton={handleClosedButton}
      // showButton={waitingTime === 0}
       showButton={true}
     ></GameScore>
   )
 }
  return (
    <Container>
      {/* {gameStatus === 'none' && (
        <div className="flex justify-center items-center h-screen px-10">
          <Button
            text="back to home"
            onClick={() => {
              setGameStatus('none')
              setEventType('none')
              router.push('/play')
            }}
          />
        </div>
      )} */}
      {gameStatus === 'wait' && (
        <div className="flex justify-center items-center py-20">
          <WaitingPage
            totalPlayer={jumlahPlayer}
            waitTime={waitingTime}
            maxPlayer={maxPlayer}
            title="Balap Karung"
          />
        </div>
      )}
      {gameStatus === 'ingame' && (
        <>
          <div className="pt-5 px-2 z-10 relative ">
            <PageHeaderTitle>
              <p className="text-lg">Balap Karung</p>
            </PageHeaderTitle>
          </div>
          <div className="pt-20 pb-10 px-5">
            <div className="relative text-center h-10">
              {stateKarung === 'lompat' && (
                <p className="text-green text-sm">Lompat! ComboX {comboLompat}</p>
              )}
              {stateKarung === 'jatuh' && <p className="text-red text-sm">Aww.. kamu Jatuh..</p>}
            </div>
            <Slider ref={sliderRef} setStateKarung={setStateKarung} />
            <br />

            <p className="text-[#daa520]" id="valueCursor"></p>
          </div>
          <div className="py-10 xs:px-5">
            <Bubble>
              <div className="h-40 flex flex-col justify-center items-center px-5 gap-5">
                <p className="text-center"> Tekan lompat saat cursor berada di area hijau!</p>
                { showJumpButton && (
                  <Button text="Lompat" onClick={handleJump}></Button>
                )}
              </div>
            </Bubble>
          </div>
        </>
      )}
    </Container>
  )
}

export default RacingGame
