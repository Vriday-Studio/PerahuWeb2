import Image from 'next/image'

interface props {
  text?: string
  children?: React.ReactNode
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type']
  onClick?: () => void
  disabled?: boolean
  isLoading?: boolean
  className?: string
}

const Button = ({ text, children, type, onClick, disabled, isLoading = false, className }: props) => {
  // Default base styles
  const baseStyles = 'px-4 py-2.5 font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed'
  
  // If custom className is provided, merge with base styles
  if (className) {
    return (
      <button
        onClick={onClick}
        type={type}
        disabled={disabled}
        className={`${baseStyles} ${className}`}
      >
        {isLoading && (
          <div className="flex items-center justify-center h-6">
            <div className="border-t-2 border-l-2 rounded-full border-white w-6 h-6 animate-spin"></div>
          </div>
        )}
        {!isLoading && (children || text)}
      </button>
    )
  }

  // Default rendering with wrapper
  return (
    <div className="h-12 w-full">
      <button
        onClick={onClick}
        type={type}
        disabled={disabled}
        className={`active:outline-none w-full p-3 text-white rounded-2xl border shadow-[0_6px_18px_rgba(0,0,0,0.2)] touch-manipulation select-none cursor-pointer ${
          disabled
            ? 'bg-gray-600 border-gray-600 text-white cursor-not-allowed'
            : 'bg-primary-orange border-primary-orange active:translate-y-1 transform duration-75'
        }`}
      >
        {isLoading && (
          <div className="flex items-center justify-center h-6">
            <div className="border-t-2 border-l-2 rounded-full border-white w-6 h-6 animate-spin"></div>
          </div>
        )}
        {!isLoading && (children || text)}
      </button>
    </div>
  )
}

export const BrownButton = ({ text, type, onClick, disabled }: props) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`active:outline-none w-full p-3 text-white rounded-2xl border h-14 mb-4 shadow-[0_6px_18px_rgba(0,0,0,0.2)] touch-manipulation select-none cursor-pointer ${
        disabled
          ? 'bg-gray-600 border-gray-600 text-white cursor-not-allowed'
          : 'bg-primary-orange border-primary-orange active:translate-y-1 transform duration-75'
      }`}
    >
      {text}
    </button>
  )
}

interface LoginAsProps {
  image: string
  alt: string
  imgStyle?: string
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

export const LoginAs = ({ image, alt, imgStyle, onClick }: LoginAsProps) => (
  <div
    onClick={onClick}
    className="rounded-2xl border-primary-orange border-[1px] bg-primary-orange active:translate-y-1 transform duration-75 flex justify-center items-center cursor-pointer"
  >
    <Image className={`${imgStyle}`} src={image} alt={`${alt} icon`} width={70} height={70} />
  </div>
)

interface ButtonIconProps {
  image_path: string
  disabled?: boolean
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

export const ButtonIcon = ({ image_path, onClick, disabled }: ButtonIconProps) => (
  <div
    onClick={onClick}
    className={`relative flex justify-center items-center active:outline-none w-[50px] h-[50px] p-1 cursor-pointer active:translate-y-1 transform duration-75 touch-manipulation select-none
    rounded-2xl
      ${disabled ? 'bg-gray-700 text-gray-400' : 'bg-primary-orange shadow-[0_6px_18px_rgba(0,0,0,0.2)]'}
    `}
  >
    <Image
      src={image_path}
      alt={'Button Icon'}
      width={30}
      height={30}
      className="w-auto h-auto outline-none flex items-center"
      draggable={false}
    />
  </div>
)

interface ButtonGenderToggleProps {
  image_path: string
  gender: boolean
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

export const ButtonGenderToggle = ({ image_path, gender, onClick }: ButtonGenderToggleProps) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center cursor-pointer active:translate-y-1 transform duration-75 rounded-3xl border border-primary-brass bg-gray-black"
    >
      <div
        className="flex items-center p-2 w-[50px] h-[50px] active:outline-none rounded-3xl bg-primary-darker border border-primary-brass"
      >
        <Image
          src={image_path}
          alt={'Gennder Icon'}
          width={30}
          height={60}
          className="w-auto h-auto outline-none "
          draggable={false}
        />
      </div>
    </div>
  )
}

type QuizButtonProps = {
  text: string
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type']
  value?: any
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
  theCorrectAnswer?: boolean
  isWrong?: boolean
  isRevealAnswer?: boolean
  isHidden?: boolean
}

export const QuizButton = ({
  text,
  type,
  value,
  onClick,
  disabled,
  theCorrectAnswer,
  isWrong,
  isRevealAnswer,
  isHidden,
}: QuizButtonProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick(value)
    }
  }
  return (
    <button
      value={value}
      onClick={handleClick}
      type={type}
      disabled={disabled}
      className={`relative outline-none h-14 border-cream border rounded-2xl px-3 py-2 bg-gray-black text-cream w-full mb-2 
      ${isHidden ? 'opacity-0 select-none pointer-events-none' : 'block'}
      ${
        isRevealAnswer
          ? theCorrectAnswer
            ? 'bg-correct border-none text-white'
            : isWrong
            ? 'bg-wrong border-none text-white'
            : disabled
            ? 'border-none bg-gray text-white transform-none active:text-white'
            : ''
          : 'active:translate-y-1 transform duration-75 focus:bg-primary-orange focus:text-white'
      }
     `}
    >
      {text}
    </button>
  )
}

type QuizLifeLineButtonProps = {
  text: string
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type']
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
  preventClick?: boolean
}

export const QuizLifeLineButton = ({
  text,
  type,
  onClick,
  disabled,
  preventClick,
}: QuizLifeLineButtonProps) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`relative outline-none h-14 w-14 text-center border border-cream rounded-2xl bg-gray-black text-cream text-xs
      active:translate-y-1 transform duration-75
      disabled:transform-none disabled:bg-gray-700 disabled:border-gray-700 disabled:text-gray-400
      z-0 ${preventClick ? 'pointer-events-none' : ''}
      `}
    >
      {text}
    </button>
  )
}

export default Button
