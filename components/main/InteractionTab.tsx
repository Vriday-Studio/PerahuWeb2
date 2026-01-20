import React, { useState } from 'react'
//import Button from '../Button'

import Image from 'next/image'
import { useUserStore } from '@/store/user'
import { database } from '@/app/firebase'
import { ref, update } from 'firebase/database'

interface props {
  text: string
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type']
  onClick?: () => void
  disabled?: boolean
  isLoading?: boolean
}
const Button = ({ text, type, onClick, disabled, isLoading = false }: props) => {
  return (
    <div className="h-12 w-full">
      <button
        onClick={onClick}
        type={type}
        disabled={disabled}
        className={`bg-primary-orange active:outline-none w-full p-3 text-white rounded-full border border-primary-orange shadow-[0_6px_18px_rgba(0,0,0,0.2)] touch-manipulation select-none cursor-pointer ${
          disabled
            ? 'disabled:cursor-not-allowed disabled:bg-gray-700 disabled:border-gray-700 disabled:text-gray-400'
            : 'active:translate-y-1 transform duration-75'
        }`}
      >
        {isLoading && (
          <div className="flex items-center justify-center h-6">
            <div className="border-t-2 border-l-2 rounded-full border-white w-6 h-6 animate-spin"></div>
          </div>
        )}
        {!isLoading && text}
      </button>
    </div>
  )
}
type Button = {
  src?: string
  text: string
  value: string
}

type TabProps = {
  buttons: Button[]
  type?: 'emoji' | 'button'
}

type TselectedTab = {
  selected: 'Jawaban' | 'Pertanyaan' | 'emoji' | 'Tempat'
}

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}
function chatmsgInterval(min: number, max: number) {
  // min and max included
  const randchat = randomIntFromInterval(min, max)
  //return randchat:string;
  //chatmsg(true, randchat);
}

const Jawaban: Button[] = [
]

const Pertanyaan: Button[] = [
]

const Kabar: Button[] = [
  { text: 'Apa Kabar?', value: 'Apa Kabar?' },
  { text: 'Gimana Kabar?', value: 'Gimana Kabar?' },
]
const Kabarjawab: Button[] = [
  { text: 'Baik, dong.', value: 'Baik, dong.' },
  { text: 'Baik! Kamu gimana?', value: 'Baik! Kamu gimana?' },
  { text: 'Sehat! Kamu Gimana?.', value: 'Sehat! Kamu Gimana?.' },
  { text: 'Lagi Gembira', value: 'Lagi Gembira' },
]
const Asal: Button[] = [
  { text: 'Kamu dari mana', value: 'Kamu dari mana' },
  { text: 'Asli mana?', value: 'Asli mana?' },
  { text: 'Kamu tinggal di mana?', value: 'Kamu tinggal di mana?' },
]
const AsalJawab: Button[] = [
  { text: 'Aku tinggal di Jakarta.', value: 'Aku tinggal di Jakarta.' },
  { text: 'Aku dari Surabaya?', value: 'Aku dari Surabaya?' },
  { text: 'Aku berasal dari Bandung', value: 'Aku berasal dari Bandung' },
  { text: 'Aku dari Yogyakarta.', value: 'Aku dari Yogyakarta.' },
  { text: 'Aku tinggal di Medan.', value: 'Aku tinggal di Medan.' },
  { text: 'Aku dari Bali.', value: 'Aku dari Bali.' },
  { text: 'Aku berasal dari Makassar.', value: 'Aku berasal dari Makassar.' },
  { text: 'Aku dari Semarang.', value: 'Aku dari Semarang.' },
  { text: 'Aku tinggal di Palembang.', value: 'Aku tinggal di Palembang.' },
  { text: 'Aku dari Malang.', value: 'Aku dari Malang.' },
  { text: 'Aku dari Banten.', value: 'Aku dari Banten.' },
  { text: 'Aku dari Jawa Barat.', value: 'Aku dari Jawa Barat.' },
  { text: 'Aku dari Jawa Tengah.', value: 'Aku dari Jawa Tengah.' },
  { text: 'Aku dari Jawa Timur.', value: 'Aku dari Jawa Timur.' },
  { text: 'Aku dari Riau.', value: 'Aku dari Riau.' },
  { text: 'Aku dari Jambi.', value: 'Aku dari Jambi.' },
  { text: 'Aku dari Aceh.', value: 'Aku dari Aceh.' },
  { text: 'Aku dari Papua.', value: 'Aku dari Papua.' },
  { text: 'Aku dari Lampung.', value: 'Aku dari Lampung.' },
  { text: 'Aku dari Sumatera Utara.', value: 'Aku dari Sumatera Utara.' },
  { text: 'Aku dari Kalimantan.', value: 'Aku dari Kalimantan.' },
  { text: 'Aku dari Kalimantan Timur.', value: 'Aku dari Kalimantan Timur.' },
  { text: 'Aku dari Sulawesi.', value: 'Aku dari Sulawesi.' },
  { text: 'Aku dari Sulawesi Selatan.', value: 'Aku dari Sulawesi Selatan.' },
  { text: 'Aku dari Nusa Tenggara Barat.', value: 'Aku dari Nusa Tenggara Barat.' },
  { text: 'Aku dari Nusa Tenggara Timur.', value: 'Aku dari Nusa Tenggara Timur.' },
  { text: 'Aku dari Maluku.', value: 'Aku dari Maluku.' },
  { text: 'Aku dari Madura.', value: 'Aku dari Madura.' },
  
]
const TempatP: Button[] = [
  { text: 'Ke mana kita?', value: 'Ke mana kita?' },
  { text: 'Enaknya ke mana?', value: 'Enaknya ke mana?' },
  { text: 'Mau jalan ke mana?', value: 'Mau jalan ke mana?' },
  { text: 'Liat (AREA) aja, yuk!', value: 'Liat (AREA) aja, yuk!' },
  { text: 'Jalan ke (AREA), yuk!', value: 'Jalan ke (AREA), yuk!' },
]
const TempatJawab: Button[] = [
  { text: 'Liat Tarian Indonesia aja, yuk!', value: 'Liat Tarian Indonesia aja, yuk!' },
  { text: 'Liat Batik & Tenun aja, yuk!', value: 'Liat Batik & Tenun aja, yuk!' },
  { text: 'Liat Wayang Indonesia aja, yuk!', value: 'Liat Wayang Indonesia aja, yuk!' },
  { text: 'Liat Alat Musik Tradisional aja, yuk!', value: 'Liat Alat Musik Tradisional aja, yuk!' },
  { text: 'Liat Makanan Indonesia aja, yuk!', value: 'Liat Makanan Indonesia aja, yuk!' },
  { text: 'Liat Pasar Terapung aja, yuk!', value: 'Liat Pasar Terapung aja, yuk!' },
  { text: 'Liat Arungi aja, yuk!', value: 'Liat Arungi aja, yuk!' },
  { text: 'Jalan ke Tarian Indonesia, yuk!', value: 'Jalan ke Tarian Indonesia, yuk!' },
  { text: 'Jalan ke Batik dan Tenun, yuk!', value: 'Jalan ke Batik dan Tenun, yuk!' },
  { text: 'Jalan ke Wayang Indonesia, yuk!', value: 'Jalan ke Wayang Indonesia, yuk!' },
  { text: 'Jalan ke Alat Musik Tradisional, yuk!', value: 'Jalan ke Alat Musik Tradisional, yuk!' },
  { text: 'Jalan ke Makanan Indonesia, yuk!', value: 'Jalan ke Makanan Indonesia, yuk!' },
  { text: 'Jalan ke Pasar Terapung, yuk!', value: 'Jalan ke Pasar Terapung, yuk!' },
  { text: 'Jalan ke Arungi, yuk!', value: 'Jalan ke Arungi, yuk!' },
]
const DenganSiapa: Button[] = [
  { text: 'Sama siapa ke sini?', value: 'Sama siapa ke sini?' },
  { text: 'Kamu sendirian aja?', value: 'Kamu sendirian aja?' },
  { text: 'Kamu datang sama siapa?', value: 'Kamu datang sama siapa?' },
  { text: 'Kamu ke sini sama siapa?', value: 'Kamu ke sini sama siapa?' },
]
const DenganSiapaJawab: Button[] = [
  { text: 'Sendirian aja, nih.', value: 'Sendirian aja, nih.' },
  { text: 'Rame-rame, kok.', value: 'Rame-rame, kok.' },
  { text: 'Sama teman-teman.', value: 'Sama teman-teman.' },
  { text: 'Sama pacar.', value: 'Sama pacar.' },
  { text: 'Sama keluarga.', value: 'Sama keluarga.' },
  { text: 'Sama anak-anak.', value: 'Sama anak-anak.' },
]

const TarianIndo : Button[] = [
  { text: 'Lihat tari tradisional, ah.', value: 'Lihat tari tradisional, ah.' },
  { text: 'Jadi pengen belajar nari, deh.', value: 'Jadi pengen belajar nari, deh.' },
  { text: 'Tarian daerahnya keren banget!', value: 'Tarian daerahnya keren banget!' },
  { text: 'Yuk, coba nari bareng!', value: 'Yuk, coba nari bareng!' },
]

const BatikTenun : Button[] = [
  { text: 'Penasaran, deh, sama cara bikin batik.', value: 'Penasaran, deh, sama cara bikin batik.' },
  { text: 'Corak Batik Indonesia unik banget!', value: 'Corak Batik Indonesia unik banget!' },
  { text: 'Batiknya cantik-cantik!', value: 'Batiknya cantik-cantik!' },
  { text: 'Jadi pengen punya baju batik baru.', value: 'Jadi pengen punya baju batik baru.' },
]

const WayangIndo : Button[] = [
  { text: 'Nonton wayang, yuk!', value: 'Nonton wayang, yuk!' },
  { text: 'Ternyata susah juga main wayang…', value: 'Ternyata susah juga main wayang…' },
  { text: 'Cerita wayangnya menarik banget!', value: 'Cerita wayangnya menarik banget!' },
  { text: 'Mau belajar jadi dalang, deh.', value: 'Mau belajar jadi dalang, deh.' },
]

const Makanan : Button[] = [
  { text: 'Banyak juga pilihan makanannya.', value: 'Banyak juga pilihan makanannya.' },
  { text: 'Bingung mau makan apa…', value: 'Bingung mau makan apa…' },
  { text: 'Makanan tradisionalnya enak!', value: 'Makanan tradisionalnya enak!' },
  { text: 'Mau coba semua makanan di sini!', value: 'Mau coba semua makanan di sini!' },
]
const AlatMusik : Button[] = [
  { text: 'Jadi pengen belajar musik, deh.', value: 'Jadi pengen belajar musik, deh.' },
  { text: 'Boleh coba main nggak, ya?', value: 'Boleh coba main nggak, ya?' },
  { text: 'Suaranya unik banget!', value: 'Suaranya unik banget!' },
  { text: 'Musik tradisionalnya asyik!, deh.', value: 'Musik tradisionalnya asyik!, deh.' },
]
const PasarTerapung : Button[] = [
  { text: 'Wah, ada pasar terapung!', value: 'Wah, ada pasar terapung!' },
  { text: 'Jual buah-buahan, gak, ya?', value: 'Jual buah-buahan, gak, ya?' },
  { text: 'Seru juga belanja di pasar terapung.', value: 'Seru juga belanja di pasar terapung.' },
  { text: 'Pasar terapungnya ramai banget!', value: 'Pasar terapungnya ramai banget!' },
]
const Arungi : Button[] = [
  { text: 'Ada balon udara juga di sini!', value: 'Ada balon udara juga di sini!' },
  { text: 'Bisa keliling Indonesia nggak, ya?', value: 'Bisa keliling Indonesia nggak, ya?' },
  { text: 'Pemandangan dari sini indah banget!', value: 'Pemandangan dari sini indah banget!' },
  { text: 'Mau naik balon udara, yuk!', value: 'Mau naik balon udara, yuk!' },
]
const emoji: Button[] = [
  { src: '/assets/emoji/emoi0.png', text: 'emoji_0', value: 'emoji_0' },
  { src: '/assets/emoji/emoi1.png', text: 'emoji_1', value: 'emoji_1' },
  { src: '/assets/emoji/emoi2.png', text: 'emoji_2', value: 'emoji_2' },
  { src: '/assets/emoji/emoi3.png', text: 'emoji_3', value: 'emoji_3' },
  { src: '/assets/emoji/emoi4.png', text: 'emoji_4', value: 'emoji_4' },
  { src: '/assets/emoji/emoi5.png', text: 'emoji_5', value: 'emoji_5' },
  { src: '/assets/emoji/emoi6.png', text: 'emoji_6', value: 'emoji_6' },
  { src: '/assets/emoji/emoi7.png', text: 'emoji_7', value: 'emoji_7' },
  { src: '/assets/emoji/emoi8.png', text: 'emoji_8', value: 'emoji_8' },
  { src: '/assets/emoji/emoi9.png', text: 'emoji_9', value: 'emoji_9' },
  { src: '/assets/emoji/emoi10.png', text: 'emoji_10', value: 'emoji_10' },
  { src: '/assets/emoji/emoi11.png', text: 'emoji_11', value: 'emoji_11' },
  { src: '/assets/emoji/emoi12.png', text: 'emoji_12', value: 'emoji_12' },
  { src: '/assets/emoji/emoi13.png', text: 'emoji_13', value: 'emoji_13' },
  { src: '/assets/emoji/emoi14.png', text: 'emoji_14', value: 'emoji_14' },
]



const Tempat: Button[] = [
]

const TabSection: React.FC<TabProps> = ({ buttons, type }) => {
  const { userData } = useUserStore()
  const [expanded, setExpanded] = useState<string | null>(null)

  const handleClick = async (value: string) => {
    const messageWithPrefix = value.startsWith('emoji_') ? value : `chat_${value}`
    const dbUserRef = ref(database, 'Users/' + userData.userID)
    await update(dbUserRef, {
      isMessage: 'true',
      ismessage: 'true',
      message: messageWithPrefix,
    })
    window.setTimeout(() => {
      update(dbUserRef, {
        isMessage: 'false',
        ismessage: 'false',
        message: '',
      })
    }, 6000)
  }

  const handleExpand = (text: string) => {
    setExpanded(expanded === text ? null : text)
  }
  const BrownButton = ({ text, type, onClick, disabled }: props) => {
    return (
      <button
        onClick={onClick}
        type={type}
        disabled={disabled}
        className={`bg-primary-orange active:outline-none w-full p-3 text-white rounded-full border border-primary-orange h-14 mb-4 shadow-[0_6px_18px_rgba(0,0,0,0.2)] touch-manipulation select-none cursor-pointer ${
          disabled
            ? 'disabled:cursor-not-allowed disabled:bg-gray-700 disabled:border-gray-700 disabled:text-gray-400'
            : 'active:translate-y-1 transform duration-75'
        }`}
      >
        {text}
      </button>
    )
  }
  
  return (
    <div className="w-full h-full relative z-10 pointer-events-auto">
      <div
        className={` ${type === 'emoji' && 'grid grid-cols-3 xs:grid-cols-4 gap-5 '}
            h-64 overflow-auto w-full py-5 px-5 
            scrollbar scrollbar-w-[2px] 
            scrollbar-thumb-primary-brass 
            scrollbar-track-transparent  
            scrollbar-track-rounded-full 
            scrollbar-thumb-rounded-full relative z-10 pointer-events-auto`}
      >
        {buttons.map((item, index) => {
          if (type === 'emoji') {
            return <Emoji key={index} src={item.src!} onClick={() => handleClick(item.value)} />
          } else {
            return (
              <div key={index}>
                <br></br>
                <Button text={item.text} onClick={() => handleExpand(item.text)} />
                {expanded === item.text && (
                  <div className="pl-4">
                        <br></br>
                    {item.text === 'Kabar' && Kabar.map((subItem, subIndex) => (
                      <BrownButton key={subIndex} text={subItem.text} onClick={() => handleClick(subItem.value)} type="button"   />
                    ))}
                    {item.text === 'Asal' && Asal.map((subItem, subIndex) => (
                      <BrownButton key={subIndex} text={subItem.text} onClick={() => handleClick(subItem.value)} type="button"  />
                    ))}
                     {item.text === 'Tempat' && TempatP.map((subItem, subIndex) => (
                      <BrownButton key={subIndex} text={subItem.text} onClick={() => handleClick(subItem.value)} type="button"   />
                    ))}
                    {item.text === 'Dengan Siapa' && DenganSiapa.map((subItem, subIndex) => (
                      <BrownButton key={subIndex} text={subItem.text} onClick={() => handleClick(subItem.value)} type="button"   />
                    ))}
                    {item.text === 'Jawab Kabar' && Kabarjawab.map((subItem, subIndex) => (
                      <BrownButton key={subIndex} text={subItem.text} onClick={() => handleClick(subItem.value)} type="button"   />
                    ))}
                    {item.text === 'Jawab Asal' && AsalJawab.map((subItem, subIndex) => (
                      <BrownButton key={subIndex} text={subItem.text} onClick={() => handleClick(subItem.value)} type="button" />
                    ))}
                    {item.text === 'Jawab Tempat' && TempatJawab.map((subItem, subIndex) => (
                      <BrownButton key={subIndex} text={subItem.text} onClick={() => handleClick(subItem.value)} type="button"  />
                    ))}
                       {item.text === 'Jawab Dengan Siapa' && DenganSiapaJawab.map((subItem, subIndex) => (
                      <BrownButton key={subIndex} text={subItem.text} onClick={() => handleClick(subItem.value)} type="button"   />
                    ))}
                    {item.text === 'Tarian Indonesia' && TarianIndo.map((subItem, subIndex) => (
                      <BrownButton key={subIndex} text={subItem.text} onClick={() => handleClick(subItem.value)} type="button"   />
                    ))}
                     {item.text === 'Batik & Tenun' && BatikTenun.map((subItem, subIndex) => (
                      <BrownButton key={subIndex} text={subItem.text} onClick={() => handleClick(subItem.value)} type="button"   />
                    ))}
                    {item.text === 'Wayang Indonesia' && WayangIndo.map((subItem, subIndex) => (
                      <BrownButton key={subIndex} text={subItem.text} onClick={() => handleClick(subItem.value)} type="button"   />
                    ))}
                    {item.text === 'Alat Musik Tradisional' && AlatMusik.map((subItem, subIndex) => (
                      <BrownButton key={subIndex} text={subItem.text} onClick={() => handleClick(subItem.value)} type="button"   />
                    ))}
                    {item.text === 'Makanan Indonesia' && Makanan.map((subItem, subIndex) => (
                      <BrownButton key={subIndex} text={subItem.text} onClick={() => handleClick(subItem.value)} type="button"   />
                    ))}
                      {item.text === 'Pasar Terapung' && PasarTerapung.map((subItem, subIndex) => (
                      <BrownButton key={subIndex} text={subItem.text} onClick={() => handleClick(subItem.value)} type="button"   />
                    ))}
                    {item.text === 'Arungi' && Arungi.map((subItem, subIndex) => (
                      <BrownButton key={subIndex} text={subItem.text} onClick={() => handleClick(subItem.value)} type="button"   />
                    ))}
                  </div>
                )}
              </div>
            )
          }
        })}
      </div>
    </div>
  )
}

const Emoji = ({ src, onClick }: { src: string; onClick: () => void }) => (
  <div
    onClick={onClick}
    className="rounded-[24px] bg-primary-orange w-20 h-20 flex justify-center items-center border border-primary-orange cursor-pointer touch-manipulation select-none
    active:translate-y-1 transform duration-75"
  >
    <Image src={src} alt="Emoji" width={80} height={80} className="w-20 h-auto ml-2 p-2" />
  </div>
)

const InteractionTab: React.FC<TselectedTab> = ({ selected }) => {
  return (
    <div className="flex space-x-4 relative z-10 pointer-events-auto">
      {selected === 'Pertanyaan' && (
        <TabSection
          buttons={[
            { text: 'Kabar', value: '' },
            { text: 'Asal', value: '' },
            { text: 'Tempat', value: '' },
            { text: 'Dengan Siapa', value: '' },
            ...Pertanyaan,
          ]}
          type="button"
        />
      )}
      {/* {selected === 'area' && <TabSection buttons={area} type="button" />} */}
      {selected === 'Jawaban' && <TabSection  buttons={[
            { text: 'Jawab Kabar', value: '' },
            { text: 'Jawab Asal', value: '' },
            { text: 'Jawab Tempat', value: '' },
            { text: 'Jawab Dengan Siapa', value: '' },
            ...Jawaban,
          ]}
          type="button" />}
      {selected === 'emoji' && <TabSection buttons={emoji} type="emoji" />}
      {selected === 'Tempat' && <TabSection  buttons={[
            { text: 'Tarian Indonesia', value: '' },
            { text: 'Batik & Tenun', value: '' },
            { text: 'Wayang Indonesia', value: '' },
            { text: 'Alat Musik Tradisional', value: '' },
            { text: 'Makanan Indonesia', value: '' },
            { text: 'Pasar Terapung', value: '' },
            ...Tempat,
          ]}
          type="button" />}
    </div>
  )
}

export default InteractionTab
