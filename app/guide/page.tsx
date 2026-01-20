'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Carousel from '@/components/Carousel'
import BackIcon from '@/components/BackIcon'
import LoadingScreen from '@/components/LoadingScreen'
import { getContentSettingByTag } from '@/lib/firebase/contentSetting'
import { sanitizeDOM } from '@/lib/sanitizeDOM'

type GuideContent = {
  title: string
  description: string
  images: string[]
}

const GuidePage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedContent, setSelectedContent] = useState<GuideContent[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const router = useRouter()

  const handleActiveIndex = (index: number) => {
    setActiveIndex(index)
  }

  const handleNavigate = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('hasCompletedTutorial', 'true')
    }
    router.push('/start')
  }

  useEffect(() => {
    const fetchContent = async () => {
      const contents = await getContentSettingByTag('guide', 'asc')
      setSelectedContent(contents)
      setIsLoading(false)
    }
    fetchContent()
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="w-full max-h-screen relative font-playfair">
      <BackIcon className="absolute left-2 top-2 z-10" />
      <Carousel
        loop={false}
        positionNavigation="flex justify-between items-center top-1/3"
        positionPagination="bottom-[7rem] left-1/2 -translate-x-1/2"
        handleActiveIndex={handleActiveIndex}
      >
        {selectedContent.map((s) => (
          <div
            key={s.title}
            className="w-full flex-shrink-0 h-screen object-cover text-gray-black bg-primary-orange"
          >
            <div className="bg-gray h-1/2">
              <img src={s.images[0]} alt="Guide" className="w-full h-3/5 object-cover absolute" />
            </div>
            <div className="bg-guide flex justify-start items-center flex-col gap-2 px-16 py-5 h-1/2">
              <h1 className="text-2xl font-bold">{s.title}</h1>
              <hr className="border-t-4 border-gray-black w-full h-1" />
              <div
                className="text-xs font-light text-center tracking-wide unreset"
                dangerouslySetInnerHTML={{ __html: sanitizeDOM(s.description) }}
              ></div>
            </div>
          </div>
        ))}
      </Carousel>
      <button
        onClick={handleNavigate}
        className="absolute bottom-[4rem] left-1/2 -translate-x-1/2 text-white bg-gray-black px-10 py-2 rounded-full"
      >
        {activeIndex === selectedContent.length - 1 ? 'Selesai' : 'Lewati'}
      </button>
    </div>
  )
}

export default GuidePage
