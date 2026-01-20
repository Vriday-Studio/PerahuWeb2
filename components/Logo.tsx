import Image from 'next/image'

const Logo = () => {
  return (
    <Image
      src="/assets/logo.svg"
      alt="logo"
      width={250}
      height={70}
      className="w-3/4 h-auto"
      priority
    />
  )
}

export default Logo
