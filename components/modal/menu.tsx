import React from 'react'
import Button from '../Button'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/user'
import AvatarProfile from '../avatar/Profile'

type TModal = {
  showModal: boolean
  closeModal: () => void
  onSignOut: () => void
  onAvatar: () => void
  isGuest?: boolean
}

const MenuModal = ({ showModal, closeModal, onSignOut, onAvatar, isGuest }: TModal) => {
  const router = useRouter()
  const { userData } = useUserStore()

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 flex items-center justify-center w-full px-5 z-20`}
        >
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.5 }}
            className="bg-primary-darker rounded-[32px] h-[420px] w-[343px] border border-primary-brass shadow-lg z-10 relative flex flex-col justify-center items-center gap-5"
          >
            <div className="absolute -top-6 w-full flex justify-center">
              <div className="bg-primary-orange rounded-2xl px-6 py-2 text-white text-lg shadow-[0_6px_18px_rgba(0,0,0,0.2)]">
                Pengaturan
              </div>
            </div>
            <div className="flex flex-col w-full px-8 sm:px-10 gap-10 mt-5">
              <div className="grid grid-flow-col gap-5 mt-10 w-full ">
                <div className="rounded-3xl border border-primary-brass bg-gray-black w-28 h-28 overflow-hidden relative">
                  <div className="mt-10">
                    <AvatarProfile />
                  </div>
                </div>
                <p className="flex gap-2 text-primary-brass text-2xl items-center">
                  <Image
                    src={`/assets/icon/${userData?.Avatar[0] ? 'male' : 'female'}.svg`}
                    alt="Male Icon"
                    width={24}
                    height={24}
                    className="w-6 h-auto"
                  />
                  {userData.Name}
                </p>
              </div>

              <div className=" w-full z-10">
                {!isGuest && <Button text={'Ubah Avatar'} onClick={onAvatar} />}
                <div className="mb-2"></div>
                <Button text={'Keluar dari Permainan'} onClick={onSignOut} />
                <div className="mb-2"></div>
                <Button text={'Kembali'} onClick={closeModal} type="button" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MenuModal
