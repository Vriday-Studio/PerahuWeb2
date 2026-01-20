'use client'

import BackIcon from '@/components/BackIcon'
import Loading from '@/components/Loading'

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-primary-dark">
      <BackIcon url="/" className="absolute top-2 left-2" />
      <Loading />
    </div>
  )
}

export default LoadingScreen
