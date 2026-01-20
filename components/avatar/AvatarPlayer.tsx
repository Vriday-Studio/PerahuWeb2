'use client'
import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { useAvatarStore } from '@/store/avatar'
import useStore from '@/hooks/useStore'
import Loading from '../Loading'

type TAvatarPlayer = {
  width?: number
  height?: number
}

const BlingkingEyes = ({ width, height, eyesPath }: TAvatarPlayer | any) => {
  const [isClosed, setIsClosed] = useState(false)

  const handleInterval = useCallback(() => {
    setIsClosed((prevIsClosed) => !prevIsClosed)
  }, [])

  useEffect(() => {
    const intervalId = setInterval(handleInterval, 1000)

    return () => clearInterval(intervalId)
  }, [handleInterval])

  return (
    <>
      {eyesPath && (
        <Image
          src={isClosed ? '/assets/avatar/eyeclose.png' : eyesPath}
          alt="eyes"
          width={width ? width : 384}
          height={height ? height : 384}
          className={`${width ? `w-[${width}px]` : 'w-96'} ${
            height ? `w-[${height}px]` : 'h-96'
          } absolute top-0 z-50`}
          priority
        />
      )}
    </>
  )
}

const AvatarPlayer = ({ width, height }: TAvatarPlayer) => {
  const store = useStore(useAvatarStore, (state) => state)
  const avatarState = store?.avatarState

  const currentGender = store?.gender ? 'male' : 'female'
  // const hasHydrated = useStore(useAvatarStore, (state) => state._hasHydrated)h

  if (store && !store._hasHydrated) {
    return <Loading />
  }

  if (!avatarState) {
    return <Loading />
  }

  const hatPath = avatarState[currentGender]?.hat?.path
  const hairPath = avatarState[currentGender]?.hair?.path
  const hairSubPath = avatarState[currentGender]?.hair?.sub_path
  const eyebrowPath = avatarState[currentGender].eyebrow.path
  const eyesPath = avatarState[currentGender].eyes.path
  const nosePath = avatarState[currentGender].nose.path
  const mouthPath = avatarState[currentGender].mouth.path
  const clothPath = avatarState[currentGender].clothes.path
  const shirtPath = avatarState[currentGender].shirt.path
  const pantsPath = avatarState[currentGender].pants.path
  const shoesPath = avatarState[currentGender].shoes.path
  const accessoriesPath = avatarState[currentGender].accessories.path
  const accessoriesSubPath = avatarState[currentGender].accessories.sub_path

  const noHairNeeded = avatarState[currentGender].clothes.no === 5

  return (
    <div
      className={`bg-transparent relative z-0 ${width ? `w-[${width}px]` : 'w-96'} ${
        height ? `w-[${height}px]` : 'h-96'
      }`}
    >
      {avatarState && (
        <>
          {avatarState[currentGender].isHat === 1 && hatPath && (
            <Image
              src={hatPath}
              alt="hat"
              width={width ? width : 384}
              height={height ? height : 384}
              className={`${width ? `w-[${width}px]` : 'w-96'} ${
                height ? `w-[${height}px]` : 'h-96'
              } absolute top-0 z-10`}
              priority
            />
          )}

          {hairPath && !noHairNeeded && (
            <Image
              src={hairPath}
              alt="hair"
              width={width ? width : 384}
              height={height ? height : 384}
              className={`${width ? `w-[${width}px]` : 'w-96'} ${
                height ? `w-[${height}px]` : 'h-96'
              } absolute top-0 z-0`}
              priority
            />
          )}
          {hairSubPath && !noHairNeeded && (
            <Image
              src={hairSubPath}
              alt="hair"
              width={width ? width : 384}
              height={height ? height : 384}
              className={`${width ? `w-[${width}px]` : 'w-96'} ${
                height ? `w-[${height}px]` : 'h-96'
              } absolute top-0 -z-10`}
              priority
            />
          )}
          {eyebrowPath && (
            <Image
              src={eyebrowPath}
              alt="brow"
              width={width ? width : 384}
              height={height ? height : 384}
              className={`${width ? `w-[${width}px]` : 'w-96'} ${
                height ? `w-[${height}px]` : 'h-96'
              } absolute top-0 `}
              priority
            />
          )}
          {<BlingkingEyes width={width} height={height} eyesPath={eyesPath} />}
          {nosePath && (
            <Image
              src={nosePath}
              alt="nose"
              width={width ? width : 384}
              height={height ? height : 384}
              className={`${width ? `w-[${width}px]` : 'w-96'} ${
                height ? `w-[${height}px]` : 'h-96'
              } absolute top-0 `}
              priority
            />
          )}
          {mouthPath && (
            <Image
              src={avatarState[currentGender].mouth.path}
              alt="mouth"
              width={width ? width : 384}
              height={height ? height : 384}
              className={`${width ? `w-[${width}px]` : 'w-96'} ${
                height ? `w-[${height}px]` : 'h-96'
              } absolute top-0 `}
              priority
            />
          )}
          {clothPath && avatarState[currentGender].isOverall === 1 ? (
            <Image
              src={clothPath}
              alt="clothes"
              width={width ? width : 384}
              height={height ? height : 384}
              className={`${width ? `w-[${width}px]` : 'w-96'} ${
                height ? `w-[${height}px]` : 'h-96'
              } absolute top-0 z-20`}
              priority
            />
          ) : (
            <>
              {shirtPath && (
                <Image
                  src={shirtPath}
                  alt="shirt"
                  width={width ? width : 384}
                  height={height ? height : 384}
                  className={`${width ? `w-[${width}px]` : 'w-96'} ${
                    height ? `w-[${height}px]` : 'h-96'
                  } absolute top-0 z-20`}
                  priority
                />
              )}
              {pantsPath && (
                <Image
                  src={pantsPath}
                  alt="pants"
                  width={width ? width : 384}
                  height={height ? height : 384}
                  className={`${width ? `w-[${width}px]` : 'w-96'} ${
                    height ? `w-[${height}px]` : 'h-96'
                  } absolute top-0 z-10`}
                  priority
                />
              )}
            </>
          )}

          {shoesPath && (
            <Image
              src={shoesPath}
              alt="shoes"
              width={width ? width : 384}
              height={height ? height : 384}
              className={`${width ? `w-[${width}px]` : 'w-96'} ${
                height ? `w-[${height}px]` : 'h-96'
              } absolute top-0 z-0`}
              priority
            />
          )}
          {accessoriesPath && avatarState[currentGender].isAcc === 1 && (
            <>
              <Image
                src={accessoriesPath}
                alt="accessories"
                width={width ? width : 384}
                height={height ? height : 384}
                className={`${width ? `w-[${width}px]` : 'w-96'} ${
                  height ? `w-[${height}px]` : 'h-96'
                } absolute top-0 z-30`}
                priority
              />
              {accessoriesSubPath && (
                <Image
                  src={accessoriesSubPath}
                  alt="accessories"
                  width={width ? width : 384}
                  height={height ? height : 384}
                  className={`${width ? `w-[${width}px]` : 'w-96'} ${
                    height ? `w-[${height}px]` : 'h-96'
                  } absolute top-0 -z-[1]`}
                  priority
                />
              )}
            </>
          )}
          {/* 
          {avatarState[currentGender].accessories.path &&
            avatarState[currentGender].isAcc === 1 && (
              
            )} */}
          <Image
            src="/assets/avatar/main_body.png"
            alt="Main Player Body"
            width={width ? width : 384}
            height={height ? height : 384}
            className={`${width ? `w-[${width}px]` : 'w-96'} ${
              height ? `w-[${height}px]` : 'h-96'
            } z-10`}
            priority
          />
        </>
      )}
    </div>
  )
}

export default AvatarPlayer
