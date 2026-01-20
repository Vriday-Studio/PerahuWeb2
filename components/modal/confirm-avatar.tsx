import React from 'react'
import AvatarPlayer from '../avatar/AvatarPlayer'

import Button from '../Button'

type TModal = {
  showModal: boolean
  closeModal: () => void
  handleSavedAvatar: any
}

const ConfirmAvatarModal = ({ showModal, closeModal, handleSavedAvatar }: TModal) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        showModal ? 'visible z-20' : 'invisible'
      }`}
    >
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-primary-darker rounded-[32px] h-[611px] w-[343px] border border-primary-brass shadow-lg relative flex flex-col justify-center items-center gap-5 z-50">
        <div className="absolute -top-6 w-full flex justify-center">
          <div className="bg-primary-orange rounded-2xl px-6 py-2 text-white text-lg shadow-[0_6px_18px_rgba(0,0,0,0.2)]">
            Konfirmasi Avatar
          </div>
        </div>
        <div className="z-50">
          <AvatarPlayer width={300} height={300} />
        </div>
        <div className="text-center text-primary-brass ">
          <p className="text-xl">Terlihat bagus?</p>
          <p className="text-sm">Anda selalu dapat mengubah tampilan anda nanti.</p>
        </div>
        <div className="px-10  w-full z-10">
          <Button text={'Konfirm'} onClick={handleSavedAvatar} />
          <div className="mb-2"></div>
          <Button text={'Kembali'} onClick={closeModal} type="button" />
        </div>
      </div>
    </div>
  )
}

export default ConfirmAvatarModal
