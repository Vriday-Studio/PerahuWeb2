import React from 'react'

const Loading = () => {
  return (
    <div className="h-screen max-w-md  m-auto  relative flex justify-center items-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-brass to-gray-black animate-spin">
        <div className="h-12 w-12 rounded-full bg-primary-darker"></div>
      </div>
    </div>
  )
}

export default Loading
