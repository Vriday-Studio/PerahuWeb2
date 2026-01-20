import { useAvatarStore } from '@/store/avatar'
import React from 'react'
import { useStore } from 'zustand'
import Image from 'next/image'
import Loading from '../Loading'

type Tprops = {
  avatar_default?: boolean
  gender?: string
  scale?: number
}

const AvatarProfile = ({ avatar_default, gender, scale }: Tprops) => {
  const store = useStore(useAvatarStore, (state) => state)
  const currentAvatarState = store?.currentAvatarState
  const defaultAvatarState = store?.avatarState

  if (store && !store._hasHydrated) {
    return <Loading />
  }

  if (!currentAvatarState) {
    return <Loading />
  }

  let hatPath = currentAvatarState?.hat?.path
  let hairPath = currentAvatarState?.hair?.path
  let hairSubPath = currentAvatarState?.hair?.sub_path
  let eyebrowPath = currentAvatarState.eyebrow.path
  let eyesPath = currentAvatarState.eyes.path
  let nosePath = currentAvatarState.nose.path
  let mouthPath = currentAvatarState.mouth.path
  let clothPath = currentAvatarState.clothes.path
  let shirtPath = currentAvatarState.shirt.path
  let accessoriesPath = currentAvatarState.accessories.path
  let accessoriesSubPath = currentAvatarState.accessories.sub_path
  let isAcc = currentAvatarState.isAcc

  if (avatar_default && gender) {
    hatPath = defaultAvatarState[gender]?.hat?.path
    hairPath = defaultAvatarState[gender]?.hair?.path
    hairSubPath = defaultAvatarState[gender]?.hair?.sub_path
    eyebrowPath = defaultAvatarState[gender]?.eyebrow.path
    eyesPath = defaultAvatarState[gender]?.eyes.path
    nosePath = defaultAvatarState[gender]?.nose.path
    mouthPath = defaultAvatarState[gender]?.mouth.path
    clothPath = defaultAvatarState[gender]?.clothes.path
    shirtPath = defaultAvatarState[gender]?.shirt.path
    accessoriesPath = defaultAvatarState[gender]?.accessories.path
    accessoriesSubPath = defaultAvatarState[gender]?.accessories.sub_path
    isAcc = defaultAvatarState[gender]?.isAcc
  }

  return (
    <>
      {currentAvatarState && (
        <>
          {hatPath && (
            <Image
              src={hatPath}
              alt="hat"
              width={400}
              height={400}
              className={`absolute top-10 z-20 transform scale-[2]`}
              priority
            />
          )}
          {hairPath && (
            <Image
              src={hairPath}
              alt="hair"
              width={400}
              height={400}
              className={`absolute top-10 z-10 transform scale-[2]`}
              priority
            />
          )}
          {hairSubPath && (
            <Image
              src={hairSubPath}
              alt="hair"
              width={400}
              height={400}
              className={`absolute top-10  transform scale-[2] -z-0`}
              priority
            />
          )}
          {eyebrowPath && (
            <Image
              src={eyebrowPath}
              alt="brow"
              width={400}
              height={400}
              className={`absolute top-10 z-10 transform scale-[2]`}
              priority
            />
          )}
          {eyesPath && (
            <Image
              src={eyesPath}
              alt="eyes"
              width={400}
              height={400}
              className={`absolute top-10 z-10 transform scale-[2]`}
              priority
            />
          )}
          {nosePath && (
            <Image
              src={nosePath}
              alt="nose"
              width={400}
              height={400}
              className={`absolute top-10 z-10 transform scale-[2]`}
              priority
            />
          )}
          {mouthPath && (
            <Image
              src={mouthPath}
              alt="mouth"
              width={400}
              height={400}
              className={`absolute top-10 z-10 transform scale-[2]`}
              priority
            />
          )}

          {clothPath && currentAvatarState.isOverall === 1 ? (
            <Image
              src={clothPath}
              alt="clothes"
              width={400}
              height={400}
              className={`absolute top-10 z-10 transform scale-[2]`}
              priority
            />
          ) : (
            <>
              {shirtPath && (
                <Image
                  src={shirtPath}
                  alt="shirt"
                  width={400}
                  height={400}
                  className={`absolute top-10 z-10 transform scale-[2]`}
                  priority
                />
              )}
            </>
          )}

          {accessoriesPath && isAcc === 1 && (
            <>
              <Image
                src={accessoriesPath}
                alt="accessories"
                width={400}
                height={400}
                className={`absolute top-10 z-10 transform scale-[2]`}
                priority
              />
            </>
          )}
        </>
      )}
      <Image
        src="/assets/avatar/main_body.png"
        alt="Main Body"
        width={400}
        height={400}
        className={`transform scale-[2]`}
        priority
      />
    </>
  )
}

export default AvatarProfile
