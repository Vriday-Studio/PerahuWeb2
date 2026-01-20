import React from 'react'
import GameMaster from './master'

const WaitingPage = ({ totalPlayer, waitTime, maxPlayer = 4, title, handleStartGame }: any) => {
  return (
    <div>
      <div className="bg-primary-darker rounded-[32px] h-[611px] w-[343px] border border-primary-brass shadow-lg relative flex flex-col justify-center items-center gap-5 z-50">
        <div className="absolute -top-6 w-full flex justify-center">
          <div className="bg-primary-orange rounded-2xl px-6 py-2 text-white text-lg shadow-[0_6px_18px_rgba(0,0,0,0.2)]">
            Memulai {title}
          </div>
        </div>
        <div className="z-50">
          <GameMaster width={300} height={300} />
        </div>
        <div className="text-center text-primary-brass ">
          <p className="text-xl">
            Menunggu Pemain ({totalPlayer} / {maxPlayer})
          </p>
          <p className="text-sm">Permainan akan langsung dimulai dalam waktu {waitTime} detik</p>
        </div>
        <div className="px-10  w-full z-10">
          {/* {waitTime === 0 && <Button text={'Memulai Permainan'} onClick={handleStartGame} />} */}
          <div className="mb-2"></div>
          {/* <Button text={'Kembali'} onClick={closeModal} type="button" /> */}
        </div>
      </div>
    </div>
  )
}
export default WaitingPage
