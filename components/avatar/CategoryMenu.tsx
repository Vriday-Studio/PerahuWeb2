'use client'
import React from 'react'
import Image from 'next/image'
import { useAvatarCategoryStore } from '@/store/avatar'
//x
const CategoryAssets = [
  {
    name: 'hair',
    path: '/assets/avatar/category/hair.svg',
  },
  {
    name: 'eyebrow',
    path: '/assets/avatar/category/eyebrow.svg',
  },
  {
    name: 'eyes',
    path: '/assets/avatar/category/eyes.svg',
  },
  {
    name: 'nose',
    path: '/assets/avatar/category/nose.svg',
  },
  {
    name: 'mouth',
    path: '/assets/avatar/category/lips.svg',
  },
  {
    name: 'shirt',
    path: '/assets/avatar/category/shirt.svg',
  },
  {
    name: 'pants',
    path: '/assets/avatar/category/pants.svg',
  },
  {
    name: 'clothes',
    path: '/assets/avatar/category/clothes.svg',
  },
  {
    name: 'shoes',
    path: '/assets/avatar/category/shoes.svg',
  },
  {
    name: 'hat',
    path: '/assets/avatar/category/hat.svg',
  },
  {
    name: 'accessories',
    path: '/assets/avatar/category/accessories.svg',
  },
]

const Category = ({ title, image_path }: any) => {
  const { category, setCategory, fetchAvatarData } = useAvatarCategoryStore()

  const handleClick = () => {
    setCategory(title)
    fetchAvatarData()
  }

  return (
    <>
      <div
        onClick={handleClick}
        className="bg-primary-orange rounded-full z-10 w-10 h-10 p-1 flex justify-center items-center cursor-pointer overflow-auto shadow-[0_6px_18px_rgba(0,0,0,0.2)]"
      >
        <Image
          src={image_path}
          alt="category icon"
          width={40}
          height={40}
          className="w-auto h-auto outline-none select-none aspect-auto"
          draggable="false"
          priority
        />
      </div>
      {title === category && (
        <p className="bg-primary-orange text-white pl-10 pr-5 py-1 h-10 rounded-full text-right flex items-center -ml-10 shadow-[0_6px_18px_rgba(0,0,0,0.2)]">
          {title}
        </p>
      )}
    </>
  )
}

const AvatarCategoryMenu = () => {
  return (
    <div
      className={`grid grid-flow-col select-none items-center gap-2 py-5 w-full overflow-auto relative whitespace-nowraps 
        scrollbar-track-rounded-xl scrollbar-thumb-rounded-xl scrollbar scrollbar-h-1 scrollbar-thumb-primary-orange scrollbar-track-primary-darker px-5
    `}
    >
      {CategoryAssets.map((item, index) => (
        <Category key={index} image_path={item.path} title={item.name} />
      ))}
    </div>
  )
}

export default AvatarCategoryMenu
