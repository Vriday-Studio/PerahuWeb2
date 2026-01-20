'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Button, { ButtonIcon } from '../Button'

type BubbleHeaderProps = {
  children: React.ReactNode
}

type BubblePaginationProps = {
  slideNo?: number
  onClickBack?: () => void
  onClickNext?: () => void
  onClickSkip?: () => void
  isLast?: boolean
}

type BubbleArrowProps = {
  onClick?: () => void
}

type BubbleProps = {
  children: React.ReactNode
  arrowdown?: boolean
}

export const Bubble = (props: BubbleProps) => {
  return (
    <div className="h-auto w-full relative border-2 border-primary-brass bg-cream rounded-[32px]">
      {props.children}
    </div>
  )
}

export const BubblePagination = ({
  slideNo,
  onClickBack,
  onClickNext,
  onClickSkip,
  isLast = false,
}: BubblePaginationProps) => {
  return (
    <div className="flex justify-between items-center">
      <div
        className={`${
          slideNo === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
        }`}
      >
        <ButtonIcon image_path={'/assets/ui/menu/chevron-left.svg'} onClick={onClickBack} />
      </div>
      {!isLast && (
        <p onClick={onClickSkip} className="opacity-75 text-red underline">
          Skip
        </p>
      )}
      <div>
        {isLast ? (
          <div>
            <Button text="Main" onClick={onClickNext}></Button>
          </div>
        ) : (
          <ButtonIcon image_path={'/assets/ui/menu/chevron-right.svg'} onClick={onClickNext} />
        )}
      </div>
    </div>
  )
}

export const BubbleHeader = ({ children }: BubbleHeaderProps) => {
  return (
    <div className="relative flex justify-center items-center">
      <div className="w-64 h-12 bg-primary-orange rounded-2xl flex items-center justify-center shadow-[0_6px_18px_rgba(0,0,0,0.2)]">
        {children}
      </div>
    </div>
  )
}

export const BubbleArrow = ({ onClick }: BubbleArrowProps) => {
  return (
    <motion.div
      onClick={onClick}
      initial={{ y: 0 }}
      animate={{ y: -5 }}
      transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1, ease: 'easeInOut' }}
      style={{ y: -5 }}
      className="relative z-20"
    >
      <svg
        className="w-6 h-6 absolute bottom-2 right-3 cursor-pointer"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          d="M6 9l6 6 6-6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary-brass"
        />
      </svg>
    </motion.div>
  )
}
