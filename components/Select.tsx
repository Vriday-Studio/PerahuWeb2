import React, { useState } from 'react'
import Image from 'next/image'

type Option = {
  label: string
  value: string
}

type SelectProps = {
  options: { value: string; label: string }[]
  onSelect: (selectedValue: any) => void
}

const CustomSelect = ({ options, onSelect }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<Option | null>(null)

  const handleSelect = (option: Option) => {
    setSelectedOption(option)
    setIsOpen(false)
    onSelect(option)
  }

  return (
    <div className="absolute flex items-center left-8 ">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 text-dark-brown py-2 px-2 rounded focus:outline-none"
      >
        {selectedOption ? selectedOption?.label : '+62'}
      </button>
      {/* {isOpen && (
        <ul
          className={`absolute  mt-10 -bottom-24 bg-beige border border-gray-300 rounded w-auto max-h-24 h-24 overflow-auto shadow-lg z-10 
          scrollbar scrollbar-w-1 scrollbar-thumb-dark-brown scrollbar-track-beige
          `}
        >
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option)}
              className={`py-2 px-4 cursor-pointer  text-dark-brown
              ${option.value === selectedOption?.value ? 'bg-red text-white' : 'bg-light'}  
              `}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )} */}
      <Image
        onClick={() => setIsOpen(!isOpen)}
        src="/assets/icon/drop-down.svg"
        alt="dropdown icon"
        className="w-3 h-auto"
        width={10}
        height={10}
      />
      <span className=" w-[2.5px] rounded-full h-6 bg-dark-brown z-0 mx-2"></span>
    </div>
  )
}

export default CustomSelect
