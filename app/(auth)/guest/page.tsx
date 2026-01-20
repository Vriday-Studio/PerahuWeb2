'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { database, auth } from '@/app/firebase'
import { get, ref, set, update } from 'firebase/database'
import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image'
import Button from '@/components/Button'
import Input from '@/components/Input'
import getRandomArbitrary from '@/utils/getRandomArbitrary'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'
import Loading from '@/components/Loading'

const Guest = () => {
  // const [playerCount, setPlayerCount] = useState<number>(0)
  const [title, setTitle] = useState('')
  const router = useRouter()
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const ranGuest = getRandomArbitrary(10, 999)
  useEffect(() => {
    setTitle('Tamu#' + ranGuest)
  }, [])

  const { status } = useSession()

  const handleAnonymousSignIn = () => {
    const timenow = new Date().toLocaleString()
    const ranEmail = getRandomArbitrary(10, 999)
    const uniq = 'Email' + ranEmail + timenow
    try {
      get(ref(database, 'isPlayerCount')).then((snapshot) => {
        if (snapshot.exists()) {
          let count = parseInt(snapshot.val())
          if(count === null || count === 0 ){
            setToastMessage(
              `Server Busy, Try again later`
            )
          } else {
          const createUserRef = ref(database, 'Users/' + count)
    
          get(createUserRef).then(async (snapshot) => {
            if (snapshot.exists()) {
              setToastMessage('Something Went Wrong!')
            } else {
              await signIn('guest-login', {
                email: uniq,
                redirect: false,
                callbackUrl: '/welcome',
              })
                .then((res) => {
                  if (res?.status === 200) {
                    set(createUserRef, {
                      Nama: title,
                      Hp: 'guest',
                      Interest: 'guest',
                      Kota: 'guest',
                      Provinsi: 'guest',
                      Gender: 'male',
                      Email: uniq,
                      Username: title,
                      Tanggal_Lahir: '',
                      ismove: 'LogOn',
                      moveX: 0,
                      moveY: 0,
                      avatar: '1, 13, 0, 0, 1, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0',
                      message: 'emoji_1',
                      isMessage: 'false',
                      npcMessage: 'false_Dadaah!_Pemusik',
                      device: window.navigator.userAgent,
                      subsEmail: '',
                    })
                      .then(() => {
                        const newPlayerCount = count + 1
                        update(ref(database, '/'), {
                          isPlayerCount: newPlayerCount.toString(),
                        })
                          .then(() => {
                            setToastMessage('Successfullt Login')
                            router.push('/welcome')
                          })
                          .catch((error) => {
                            console.log('update', error)
                            throw new Error(error)
                          })
                      })
                      .catch((error) => {
                        console.log('set', error)
                        throw new Error(error)
                      })
                  }
                })
                .catch((error) => {
                  console.log('get', error)
                  throw new Error(error)
                })
            }
          })
        }
        } else {
          console.log('No data available')
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/welcome')
    }
  }, [status, router])

  if (status === 'loading') {
    return <Loading />
  }

  return (
    <div className="bg-main bg-cover bg-no-repeat min-h-screen max-w-md w-full m-auto relative">
      <div className="flex flex-col justify-center items-center py-10">
        <Logo />
        <div className="relative flex justify-center items-center w-full mt-10">
          <Image src="/assets/cloud.svg" alt="cloud" width={350} height={70} />
          <p className="absolute text-beige text-xl">Nama Tamu (3-10 karakter) :</p>
        </div>
      </div>
      {toastMessage && <p className="text-center text-red px-5 mt-5"> {toastMessage}</p>}
      <div className="my-10 px-5">
        <input
          id="guest_name"
          type="text"
          className="bg-light border-2 border-t-4 rounded-3xl py-2 pl-10 w-full border-dark-brown outline-none"
          value={title}
          readOnly
        />
      </div>
      <div className="mt-80 pb-10 w-full p-5">
        <Button text="Masuk" onClick={handleAnonymousSignIn} />
        <div className="my-5"></div>
        <Button text="Batal" onClick={() => router.push('/sign-up')} />
      </div>
    </div>
  )
}

export default Guest
