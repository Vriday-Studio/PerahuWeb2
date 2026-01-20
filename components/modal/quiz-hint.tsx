import Image from 'next/image'
import { Bubble, BubbleArrow, BubbleHeader } from '../game/bubble'
import { AnimatePresence, motion } from 'framer-motion'

type TModal = {
  showModal: boolean
  closeModal: () => void
  link: string
}

const QuizHintModal = ({ showModal, closeModal, link }: TModal) => {
  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 w-full   z-30 max-w-md m-auto`}
        >
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
            <div className="absolute bottom-40 -left-24 w-full">
              <Image
                src="/assets/character/quizmaster.png"
                alt="cloud background center"
                width={521}
                height={521}
                className={`w-auto h-auto relative left-0 `}
              />
            </div>
            <div className="bottom-5 absolute flex px-5 ">
              <Bubble>
                <div className="absolute -top-8 -left-5 w-64">
                  <BubbleHeader>
                    <p className="absolute text-white flex items-center justify-center text-center text-base w-full h-full">
                      Quiz Master
                    </p>
                  </BubbleHeader>
                </div>
                <div className="p-5 flex justify-center items-center relative h-44 text-center">
                  <a className="text-primary-brass underline" href={link}>
                    {link}
                  </a>
                </div>
                <BubbleArrow onClick={closeModal} />
              </Bubble>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default QuizHintModal
