import Image from 'next/image'

interface props {
  id: string
  icon?: string
  label?: string
  placeholder: string
  type: string
  value?: string
  register?: any
  autoComplete?: string
  onChange?: any
  readOnly?: boolean
}

const Input = ({
  id,
  icon,
  label,
  placeholder,
  type,
  value,
  register,
  autoComplete,
  onChange,
  readOnly,
}: props) => {
  return (
    <div className="w-full mt-3">
      <label className="my-2 text-dark-brown">{label}</label>
      <div className={`relative flex items-center ${readOnly ? 'filter grayscale' : ''}`}>
        {icon && (
          <Image
            className="absolute left-3 w-auto h-auto"
            src={icon}
            alt="icon"
            width={20}
            height={20}
          />
        )}
        <input
          id={id}
          type={type}
          className={`bg-light border-2 border-t-4 rounded-3xl py-2 pl-10 w-full border-dark-brown outline-none `}
          placeholder={placeholder}
          value={value}
          {...register?.(id)}
          autoComplete={autoComplete}
          onChange={onChange}
          readOnly={readOnly}
        />
      </div>
    </div>
  )
}

export default Input
