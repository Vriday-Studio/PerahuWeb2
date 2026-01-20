'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Carousel from '@/components/Carousel'
import BackIcon from '@/components/BackIcon'
import LoadingScreen from '@/components/LoadingScreen'
import { getContentSettingByTag } from '@/lib/firebase/contentSetting'
import { sanitizeDOM } from '@/lib/sanitizeDOM'

type ContentItem = {
  id: string
  title: string
  description: string
  images: string[]
  tag: string
  createdAt?: string
  updatedAt?: string
}

const AboutPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const params = useParams()
  const tag = typeof params?.tag === 'string' ? params.tag : ''

  useEffect(() => {
    const fetchContent = async () => {
      const contents = await getContentSettingByTag('content')
      const contentByTag = contents.filter((item: ContentItem) => item.tag === tag)
      const latestContent = contentByTag.sort((a, b) => {
        const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime()
        const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime()
        return timeB - timeA
      })[0]
      setSelectedContent(latestContent || null)
      setIsLoading(false)
    }
    fetchContent()
  }, [tag])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!selectedContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-dark text-white">
        <BackIcon className="absolute top-2 left-2" url="/" />
        <p>Konten tidak ditemukan.</p>
      </div>
    )
  }

  const displayTitle = selectedContent.title
  const displayDescription = selectedContent.description
  const displayImages = selectedContent.images

  return (
    <div className="font-playfair">
      <BackIcon />
      <div className="w-full">
        <Carousel autoSlide hideNavigation>
          {displayImages.map((src) => (
            <img
              key={src}
              src={src}
              className="w-full flex-shrink-0 h-[60vh] min-h-[420px] object-cover object-center"
            />
          ))}
        </Carousel>
      </div>
      <div className="text-primary-orange flex justify-center items-center flex-col gap-2 px-10 py-5">
        <h1 className="text-xl font-semibold pb-2 text-center">{displayTitle}</h1>
        <div
          className="text-xs border-t-2 font-light text-center border-primary-orange py-5 tracking-wide leading-5 unreset"
          dangerouslySetInnerHTML={{ __html: sanitizeDOM(displayDescription) }}
        ></div>
      </div>
    </div>
  )
}

export default AboutPage
