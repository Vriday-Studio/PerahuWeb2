'use client'

import { useEffect, useRef, useState } from 'react'

type CarouselProps = {
  children: React.ReactNode[]
  autoSlide?: boolean
  autoSlideInterval?: number
  animationType?: 'slide' | 'fade'
  loop?: boolean
  hidePagination?: boolean
  hideNavigation?: boolean
  positionPagination?: string
  positionNavigation?: string
  handleActiveIndex?: (index: number) => void
}

const Carousel = ({
  children: slides,
  autoSlide = false,
  autoSlideInterval = 3000,
  animationType = 'slide',
  loop = true,
  hidePagination = false,
  hideNavigation = false,
  positionPagination = 'bottom-4 right-0 left-0',
  positionNavigation = 'flex items-center justify-between',
  handleActiveIndex = () => {},
}: CarouselProps) => {
  const [curr, setCurr] = useState(0)
  const [startX, setStartX] = useState<number | null>(null)
  const [isSwiping, setIsSwiping] = useState(false)
  const carouselRef = useRef<HTMLDivElement | null>(null)

  const prev = () => {
    const nextIndex = curr === 0 ? slides.length - 1 : curr - 1
    setCurr(nextIndex)
    handleActiveIndex(nextIndex)
  }

  const next = () => {
    const nextIndex = curr === slides.length - 1 ? 0 : curr + 1
    setCurr(nextIndex)
    handleActiveIndex(nextIndex)
  }

  useEffect(() => {
    if (!autoSlide) return
    const slideInterval = setInterval(next, autoSlideInterval)
    return () => clearInterval(slideInterval)
  }, [])

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setStartX(e.touches[0].clientX)
    setIsSwiping(true)
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isSwiping || startX === null) return

    const endX = e.changedTouches[0].clientX
    const diffX = startX - endX

    if (diffX > 50) {
      next()
    } else if (diffX < -50) {
      prev()
    }

    setIsSwiping(false)
  }

  const selectedStyleBasedOnAnimationType = {
    slide: {
      display: 'flex',
      transition: 'transform 0.5s ease-out',
      transform: `translateX(-${curr * 100}%)`,
    },
    fade: {
      position: 'relative' as const,
      width: '100%',
      height: '45vh',
    },
  }

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden relative w-full h-full"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div style={selectedStyleBasedOnAnimationType[animationType]}>
        {animationType === 'fade' &&
          slides.map((item, index) => (
            <div className={curr === index ? 'show' : 'not-show'} key={index}>
              {item}
            </div>
          ))}
        {animationType === 'slide' && slides}
      </div>
      {!hideNavigation && (
        <div className={`absolute inset-0 ${positionNavigation} p-4 mx-5`}>
          {!loop && curr !== 0 && (
            <button onClick={prev} className="text-4xl absolute left-0 top-1/2 -translate-y-1/2">
              &#10094;
            </button>
          )}
          {!loop && curr !== slides.length - 1 && (
            <button onClick={next} className="text-4xl absolute right-0 top-1/2 -translate-y-1/2">
              &#10095;
            </button>
          )}
          {loop && (
            <button onClick={prev} className="text-4xl absolute left-0 top-1/2 -translate-y-1/2">
              &#10094;
            </button>
          )}
          {loop && (
            <button onClick={next} className="text-4xl absolute right-0 top-1/2 -translate-y-1/2">
              &#10095;
            </button>
          )}
        </div>
      )}
      {!hidePagination && (
        <div className={`absolute ${positionPagination}`}>
          <div className="flex items-center justify-center gap-2">
            {slides.map((_, i) => (
              <div
                key={i}
                onClick={() => setCurr(i)}
                className={`transition-all duration-200 rounded-full ${
                  curr === i ? ' bg-white p-0.5 w-6 h-2' : 'bg-black/60 w-2 h-2'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Carousel
