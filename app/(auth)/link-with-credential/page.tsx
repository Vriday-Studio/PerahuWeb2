'use client'
import React, { useEffect, useState } from 'react'
import Button, { ButtonIcon, LoginAs } from '@/components/Button'
import PageHeaderTitle from '@/components/Header'
import Loading from '@/components/Loading'
import Logo from '@/components/Logo'
import { TRegisterFormSchema, registerFormSchema } from '@/lib/validation/form'

import { zodResolver } from '@hookform/resolvers/zod'

import { useSearchParams, useRouter } from 'next/navigation'

import { useForm, FieldValues } from 'react-hook-form'
import { signIn, signOut, useSession } from 'next-auth/react'
import Input from '@/components/Input'
import { auth, database } from '@/app/firebase'
import { removeAt } from '@/utils/removeAt'
import { ref, update, get, set } from 'firebase/database'
import { EmailAuthProvider, linkWithCredential, onAuthStateChanged } from 'firebase/auth'
import { useUserStore } from '@/store/user'
import { useGameStore } from '@/store/game'
import { GoogleAuthProvider } from 'firebase/auth'
const provider = new GoogleAuthProvider()
provider.setCustomParameters({
  prompt: 'select_account',
})
const LinkWithCredential = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const errorParams = searchParams.get('error')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const { status, data: SessionData } = useSession()

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<TRegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
  })
  const { setIsInitialized } = useUserStore()
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       const uid = user.uid
  //       console.log('User is signed in:', user)
  //       // ... other logic
  //     } else {
  //       console.log('User is signed out')
  //       // ... other logic
  //     }
  //   })

  //   // Clean up the subscription when the component unmounts
  //   return () => unsubscribe()
  // }, [auth])
  const { userData} = useUserStore()
  const {setStartGame,
  } = useGameStore()
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
  }
  const googleSignUp = async () => {
    handleSignOut()
    await signIn('google', { redirect: false, callbackUrl: '/sign-in' })
  }

  const onSubmit = async (data: FieldValues) => {
    handleSignOut()
    // const user = auth
    // console.log(user)
    // if (SessionData?.user && SessionData.user.isAnonymous) {
    //   const credential = EmailAuthProvider.credential(data.email, data.password)
    //   linkWithCredential(SessionData.user, credential)
    //     .then((usercred) => {
    //       const user = usercred.user
    //       console.log('Anonymous account successfully upgraded', user)
    //     })
    //     .catch((error) => {
    //       console.log('Error upgrading anonymous account', error)
    //     })
    // } else {
    //   console.log('SessionData.user is not an anonymous user')
    // }
    try {
      const checkEmailWords = removeAt(data.email).toLowerCase()

      const dbRef = ref(database, 'count/badwords')
      get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
          const strbadword = snapshot.val()
          const isBadWord = strbadword.split('_').includes(checkEmailWords)
          if (isBadWord) {
            setToastMessage(
              `Email contains a bad word. "${checkEmailWords}", please change your email`
            )
          } else {
            setToastMessage('')
            get(ref(database, 'isPlayerCount')).then((snapshot) => {
              if (snapshot.exists()) {
                let count = parseInt(snapshot.val())

                const createUserRef = ref(database, 'Users/' + count)
                get(createUserRef).then(async (snapshot) => {
                  if (snapshot.exists()) {
                    setToastMessage('User already exists')
                  } else {
                    await signIn('user-register', {
                      email: data.email,
                      password: data.password,
                      redirect: false,
                      callbackUrl: '/',
                    })
                      .then((res) => {
                        if (res?.status === 200) {
                          
                          set(createUserRef, {
                            Nama: data.name,
                            Hp: '',
                            Interest: '',
                            Kota: '',
                            Provinsi: '',
                            Gender: 'male',
                            Email: data.email,
                            Username: data.name,
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
                                  setToastMessage('Registration successful!')
                                  setIsInitialized(false)
                                  
                                  router.push('/sign-in')
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
                        if (res?.status === 401) {
                          const errorCode = JSON.parse(res?.error!).errors.code
                          if (errorCode === 'auth/email-already-in-use') {
                            setToastMessage('Email already in use')
                          }
                        }
                      })
                      .catch((error) => {
                        console.log('get', error)
                        throw new Error(error)
                      })
                  }
                })
              } else {
                console.log('No data available')
              }
            })
          }
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  if (status === 'loading') {
    return <Loading />
  }
  return (
    <div className="bg-main bg-cover bg-no-repeat min-h-screen max-w-md w-full m-auto relative">
      <div className="flex flex-col justify-center items-center pt-10">
        <Logo />
        <PageHeaderTitle>
        <div className="absolute left-10 ">
            <ButtonIcon
              image_path="/assets/ui/menu/back-icon.svg"
              onClick={() => router.push('/')}
            />
          </div>
          <p>Registrasi</p>
        </PageHeaderTitle>
      </div>
      {toastMessage && <p className="text-center text-red px-5 mt-5"> {toastMessage}</p>}
      {errorParams && <p className="text-center text-red px-5 mt-5"> {errorParams}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col justify-start items-start mb-20 p-5">
          <Input
            id="name"
            type="text"
            label="Nama"
            icon={'/assets/icon/profile.svg'}
            placeholder="Masukan nama"
            register={register}
          />

          {errors?.name && <p className="text-red text-sm ">{errors.name.message}</p>}

          <Input
            id="email"
            type="email"
            label="Alamat Email"
            icon={'/assets/icon/email.svg'}
            placeholder="Email"
            autoComplete="username"
            register={register}
          />

          {errors?.email && <p className="text-red text-sm ">{errors.email.message}</p>}

          <Input
            id="password"
            type="password"
            label="Kata sandi baru"
            icon={'/assets/icon/key.svg'}
            placeholder="Masukan kata sandi baru"
            autoComplete="new-password"
            register={register}
          />
          {errors?.password && <p className="text-red text-sm ">{errors.password.message}</p>}
          <Input
            id="confirmPassword"
            type="password"
            label="Konfirmasi kata sandi"
            icon={'/assets/icon/key.svg'}
            placeholder="Konfirmasi kata sandi"
            autoComplete="new-password"
            register={register}
          />

          {errors?.confirmPassword && (
            <p className="text-red text-sm ">{errors.confirmPassword.message}</p>
          )}
        </div>
        <div className="flex justify-center items-center gap-5">
          <LoginAs
            onClick={googleSignUp}
            image={'/assets/icon/gmail.svg'}
            alt="Gmail"
            imgStyle="p-3 h-[70px] w-[70px]"
          />
          {/* <LoginAs
            onClick={instagramSignUp}
            image={'/assets/icon/InstagramLogo.svg'}
            alt="Instagram"
            imgStyle="p-2"
          /> */}
        </div>   
        <div className="pb-10 w-full p-5">
          <Button text="Registrasi" type="submit" />
        </div>
      </form>
    </div>
  )
}

export default LinkWithCredential
