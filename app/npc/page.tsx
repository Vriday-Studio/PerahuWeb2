'use client'
import { Container } from '@/components/Container'
import { Bubble, BubbleArrow, BubbleHeader } from '@/components/game/bubble'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { ButtonIcon } from '../../components/Button'

const NPCPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  return (
    <Container>
      <div className="px-10 pt-10">
        <div className="absolute left-10 ">
          <ButtonIcon image_path="/assets/ui/menu/back-icon.svg" onClick={() => router.push('/play')} />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center gap-5 px-10 h-screen mt-10">
        <Bubble>
          <div className="absolute -top-8 -left-5 w-64">
            <BubbleHeader>
              <p className="absolute text-white flex items-center justify-center text-center text-base w-full h-full">
                {searchParams.get('title')}
              </p>
            </BubbleHeader>
          </div>
          <div className="p-5 flex justify-center items-center relative h-auto my-10 text-center">
            <p className="text-gray-black break-words leading-relaxed">
              {searchParams.get('message')}
            </p>
          </div>
          <BubbleArrow onClick={() => router.push('/play')} />
        </Bubble>
      </div>
    </Container>
  )
}

export default NPCPage
