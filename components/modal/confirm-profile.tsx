import Image from 'next/image'
import Button from '../Button'
import AvatarProfile from '../avatar/Profile'
import { AnimatePresence, motion } from 'framer-motion'

type TModal = {
  profile: {
    name: string
    gender: string
  }
  showModal: boolean
  closeModal: () => void
  onSubmit: any
}

const ConfirmProfileModal = ({ showModal, closeModal, profile, onSubmit }: TModal) => {
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
                Konfirmasi Profil
              </div>
            </div>

            <div className="grid grid-flow-col gap-5 mt-10 w-full px-10 ">
              <div className="rounded-3xl border border-primary-brass bg-gray-black w-28 h-28 overflow-hidden relative">
                <div className="mt-10">
                  <AvatarProfile avatar_default gender={profile.gender} />
                </div>
              </div>
              <p className="flex gap-2 text-primary-brass text-2xl items-center">
                <Image
                  src={`/assets/icon/${profile.gender === 'male' ? 'male' : 'female'}.svg`}
                  alt="Male Icon"
                  width={25}
                  height={25}
                  className="w-4 h-auto"
                />
                {profile?.name}
              </p>
            </div>

            <div className="text-center ">
              <p className="text-primary-brass text-xl">Sudah siap?</p>
              <p className="text-primary-brass text-sm">
                Anda selalu dapat mengubah detail anda nanti.
              </p>
            </div>
            <div className="px-10  w-full z-10">
              <Button text={'Konfirm'} type="submit" onClick={onSubmit} />
              <div className="mb-2"></div>
              <Button text={'Kembali'} onClick={closeModal} type="button" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ConfirmProfileModal
