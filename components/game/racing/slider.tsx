'use client'
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import style from './slider.module.css'
// import Image from 'next/image'
import { forwardRef } from 'react'
// import { ref } from 'firebase/database'
// import AvatarProfile from '@/components/avatar/Profile'

type SliderProps = {
  setStateKarung: (value: string) => void
}

const Slider = forwardRef(function Slider(props: SliderProps, ref) {
  const [sliderMin, setSliderMin] = useState(1)
  const [sliderMax, setSliderMax] = useState(100)
  const [directionTop, setDirectionTop] = useState(1)
  const [directionBottom, setDirectionBottom] = useState(1)
  const animationIntervalTop = useRef<any>(null)
  const animationIntervalBottom = useRef<any>(null)

  const [sliderGreenBar, setSliderGreenBar] = useState(10)
  const [greenBarWidthValue, setGreenBarWidthValue] = useState(30)
  const [sliderTopArrow, setSliderTopArrow] = useState(1)
  const [sliderBottomArrow, setSliderBottomArrow] = useState(1)
  const [sliderSpeed, setSliderSpeed] = useState(15) 

  const [showTopArrow, setShowTopArrow] = useState(false)
  const [comboLompat, setComboLompat] = useState(1)
  const [threeRedFall, setthreeRed] = useState(0)
  useEffect(() => {
    startTopArrowAnimation()
    return () => stopTopAnimation()
  }, [sliderTopArrow, showTopArrow])

  useEffect(() => {
    startBottomArrowAnimation()
    return () => stopBottomAnimation()
  }, [sliderBottomArrow, showTopArrow])

  const startBottomArrowAnimation = () => {
    animationIntervalBottom.current = setInterval(() => {
      if (sliderBottomArrow === sliderMax) {
        setDirectionBottom(-1)
      } else if (sliderBottomArrow === sliderMin) {
        setDirectionBottom(1)
      }

      setSliderBottomArrow((prevValue) => prevValue + directionBottom)
    }, sliderSpeed)
  }

  const startTopArrowAnimation = () => {
    animationIntervalTop.current = setInterval(() => {
      if (showTopArrow) {
        if (sliderTopArrow === sliderMax) {
          setDirectionTop(-1)
        } else if (sliderTopArrow === sliderMin) {
          setDirectionTop(1)
        }

        setSliderTopArrow((prevValue) => prevValue + directionTop)
      }
    }, sliderSpeed)
  }

  const stopTopAnimation = () => {
    clearInterval(animationIntervalTop.current)
  }
  const stopBottomAnimation = () => {
    clearInterval(animationIntervalBottom.current)
  }

  const resetAnimation = () => {
    setSliderBottomArrow(1)
    setSliderTopArrow(1)
    stopTopAnimation()
    stopBottomAnimation()
  }

  const handleJump = () => {
    const randomNumber = Math.floor(Math.random() * 100) + 1

    const startValue = sliderGreenBar > 50 ? sliderGreenBar - greenBarWidthValue : sliderGreenBar
    const endValue = sliderGreenBar < 50 ? sliderGreenBar + greenBarWidthValue : sliderGreenBar

    const arrowValue = showTopArrow ? sliderTopArrow : sliderBottomArrow

    if (arrowValue >= startValue && arrowValue <= endValue) {
      setSliderGreenBar(randomNumber)
      setShowTopArrow(!showTopArrow)

    console.log('lompatx'+comboLompat)
    
      props.setStateKarung('lompat')
      setComboLompat(comboLompat + 1)
      resetAnimation()
      //setSliderSpeed(Math.max(sliderSpeed - 5, 15))
      setSliderSpeed(Math.max(sliderSpeed - 5, 15))
      setGreenBarWidthValue(Math.max(greenBarWidthValue - 5, 30))
    } else {
      setSliderGreenBar(randomNumber)
      setShowTopArrow(!showTopArrow)
      
        props.setStateKarung('jatuh')
        console.log('jatuh')
        resetAnimation()
       
        setSliderSpeed(Math.max(sliderSpeed - 5, 15))
        setGreenBarWidthValue(Math.max(greenBarWidthValue - 5, 30))
     // }
    }
  }

  const getComboLompat = () => {
    return comboLompat
  }

  // Forward the handleJump function to the parent
  useImperativeHandle(ref, () => ({
    handleJump,
    setStateKarung: props.setStateKarung,
    getComboLompat,
  }))

  return (
    <div className="relative z-40 xs:px-5 h-40 ">
      {/* {showTopArrow && (
        <div
          className={`rounded-3xl bg-transparent -mt-14 -ml-10 w-28 h-28 overflow-hidden relative `}
          style={{ transform: `translateX(${sliderTopArrow * 3}%)` }}
        >
          <div className="mt-10">
            <AvatarProfile scale={1} />
          </div>
        </div>
      )} */}
      <div className="relative h-14">
        {showTopArrow && (
          <input
            id="slider-top"
            type="range"
            min="1"
            max="100"
            value={sliderTopArrow}
            className={`${style.sliderTop}`}
            onChange={(e) => setSliderTopArrow(parseInt(e.target.value))}
            ref={animationIntervalTop}
          />
        )}
      </div>
      <div className="relative border-2 border-primary-brass rounded-[100px] h-14">
        <div className="relative border-2 border-gray-black rounded-[100px]">
          <input
            id="slider-bar"
            type="range"
            min="1"
            max="100"
            value={sliderGreenBar}
            className={`${style.slider2} border border-primary-brass`}
            onChange={(e) => setSliderGreenBar(parseInt(e.target.value))}
            style={{ '--thumb-size': `${greenBarWidthValue}%` } as any}
          />
        </div>
      </div>
      <div className="relative h-14">
        {!showTopArrow && (
          <input
            id="slider-bottom"
            type="range"
            min="1"
            max="100"
            value={sliderBottomArrow}
            className={style.slider}
            onChange={(e) => setSliderBottomArrow(parseInt(e.target.value))}
            ref={animationIntervalBottom}
          />
        )}
      </div>
      {/* <input
            id="slider-bottom"
            type="range"
            min="1"
            max="100"
            value={sliderBottomArrow}
            className={style.sliderAvatar}
            onChange={(e) => setSliderBottomArrow(parseInt(e.target.value))}
          /> */}
      {/* <div
            className={`rounded-3xl bg-transparent -mt-14 -ml-14 w-28 h-28 overflow-hidden relative `}
            style={{ left: `calc(${(sliderBottomArrow / 100) * 100}%)` }}
          >
            <div className="mt-10">
              <AvatarProfile scale={1} />
            </div>
          </div> */}
      {/* {!showTopArrow && (
        <div
          className={`rounded-3xl bg-transparent -mt-14 -ml-10 w-28 h-28 overflow-hidden relative `}
          style={{
            transform: `translateX(${sliderBottomArrow * (sliderGreenWidth / 100)}%)`,
          }}
        >
          <div className="mt-10">
            <AvatarProfile scale={1} />
          </div>
        </div>
      )} */}
    </div>
  )
})

export default Slider
