'use client'
import Button, { ButtonGenderToggle, ButtonIcon } from '@/components/Button'
import PageHeaderTitle from '@/components/Header'
import AvatarPlayer from '@/components/avatar/AvatarPlayer'
import AvatarCategoryItems from '@/components/avatar/CategoryItems'
import AvatarCategory from '@/components/avatar/CategoryMenu'
import ConfirmAvatarModal from '@/components/modal/confirm-avatar'
import useStore from '@/hooks/useStore'
import { useAvatarCategoryStore, useAvatarStore } from '@/store/avatar'
import { useEffect, useState } from 'react'
import { redirect, useRouter } from 'next/navigation'
import Loading from '@/components/Loading'
import { convertStateToArray } from '@/utils/convertAvatarState'
import { useUserStore } from '@/store/user'
import { database } from '@/app/firebase'
import { ref, update } from 'firebase/database'
import { useAuth } from '@/components/providers/AuthProvider'
import { Container } from '@/components/Container'

const AvatarPage = () => {
  const router = useRouter()
  const { userData, setUserData } = useUserStore()

  const { user, isReady } = useAuth()

  const store = useStore(useAvatarStore, (state) => state)
  const { fetchAvatarData } = useAvatarCategoryStore()
  const gender = store?.gender ?? false
  const [showModal, setShowModal] = useState(false)

  const handleSwitchGender = () => {
    store?.setGender()
    fetchAvatarData()
  }

  useEffect(() => {
    if (!user) return
    fetchAvatarData()
    setUserData(user)
  }, [user, fetchAvatarData, setUserData])

  const handleModal = () => {
    setShowModal(!showModal)
  }

  const handleSavedAvatar = async () => {
    const dbRef = ref(database, 'Users/' + userData.userID)

    //convert the state to avatar value
    const avatarConvertedData = convertStateToArray(store)

    await update(dbRef, { avatar: avatarConvertedData })

    router.push('/welcome')
  }

  if (!store?._hasHydrated) {
    return <Loading />
  }

  if (!isReady) {
    return <Loading />
  }

  if (!user) {
    redirect('/sign-in')
  }
  return (
    <Container>
      <ConfirmAvatarModal
        showModal={showModal}
        closeModal={handleModal}
        handleSavedAvatar={handleSavedAvatar}
      />
      <div className=" relative flex items-center pt-5">
        <div className="absolute left-3 z-10">
          <ButtonGenderToggle
            image_path={`/assets/ui/menu/${gender ? 'male' : 'female'}-union.svg`}
            gender={gender}
            onClick={handleSwitchGender}
          />
        </div>
        <PageHeaderTitle>
          <p className="text-xl">Buat Avatar </p>
        </PageHeaderTitle>
        <div className="absolute right-5">
          <ButtonIcon
            image_path="/assets/ui/menu/back-icon-2.svg"
            onClick={() => {
              router.back()
            }}
          />
        </div>
      </div>
      <div className="  flex justify-center items-center w-full">
        <div className="flex justify-center items-center">
          <AvatarPlayer width={512} height={512} />
        </div>
      </div>
      <div className="z-20 -mt-10 w-full">
        <div className="grid grid-cols-2 grid-flow-row place-content-between place-items-end gap-10 px-5 w-full mb-5">
          <div className="w-3/4 place-self-start z-30">
            <Button text="Selesai" onClick={handleModal} />
          </div>
          <ButtonIcon image_path={'/assets/ui/menu/art.svg'} />
        </div>
        <div className="bg-gray-black border-t border-primary-brass rounded-t-xl w-full z-20">
          <AvatarCategory />
          <div className="bg-primary-darker rounded-t-xl mt-5 relative p-2">
            <AvatarCategoryItems />
          </div>
        </div>
      </div>
    </Container>
  )
}

export default AvatarPage
