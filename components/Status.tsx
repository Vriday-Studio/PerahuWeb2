import React from 'react'

const StatusToast = () => {
  return (
    <div className="rounded-3xl w-auto h-4 bg-gray-400 border-beige border-2 text-light px-2 py-3 flex justify-center items-center gap-2 text-xs">
      InGames
      {/* <span className="rounded-full bg-green w-2 h-2 animate-ping"></span> */}
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green"></span>
      </span>
    </div>
  )
}

export default StatusToast
