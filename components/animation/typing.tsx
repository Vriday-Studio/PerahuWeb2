import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import React, { useEffect } from 'react'

type TypingAnimationProps = {
  text: string
  onAnimationComplete?: () => void
}

const TypingAnimation = ({ text, onAnimationComplete }: TypingAnimationProps) => {
  const baseText = text
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const displayText = useTransform(rounded, (latest) => baseText?.slice(0, latest))

  useEffect(() => {
    const controls = animate(count, baseText?.length, {
      type: 'tween',
      duration: 3,
      ease: 'linear',
      onComplete: onAnimationComplete,
    })
    return controls.stop
  }, [text])

  return <motion.span>{displayText}</motion.span>
}

export default TypingAnimation
