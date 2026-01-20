import React, { useState } from 'react'
import Image from 'next/image'
import { useAvatarCategoryStore, useAvatarStore } from '@/store/avatar'

const Item = ({ item }: any) => {
  const { setAvatarState } = useAvatarStore()

  const handleClick = () => {
    // setPlayerBuild(item)f
    setAvatarState(item)
  }
  return (
    <div
      onClick={handleClick}
      className="w-28 h-28 bg-primary-orange flex items-center rounded-lg cursor-pointer shadow-[0_6px_18px_rgba(0,0,0,0.2)]"
    >
      <Image src={item.display_path} alt="" width={112} height={112} />
    </div>
  )
}

const AvatarCategoryItems = () => {
  const { avatarData: items } = useAvatarCategoryStore()

  return (
    <div
      className={`bg-transparent h-80 
        scrollbar scrollbar-w-[2px] 
      scrollbar-thumb-primary-brass 
      scrollbar-track-primary-darker  
        scrollbar-track-rounded-full 
        scrollbar-thumb-rounded-full
       overflow-auto
      `}
    >
      <div className="grid grid-cols-3 place-content-center place-items-center p-2 gap-3">
        {items?.map((item: any, index: any) => (
          <Item key={index} item={item} />
        ))}
      </div>
    </div>
  )
}

export default AvatarCategoryItems
