interface props {
  children: React.ReactNode
}

const PageHeaderTitle = ({ children }: props) => {
  return (
    <div className="relative flex justify-center w-full h-24 max-w-md items-center px-5 select-none">
      <div className="w-full max-w-md px-5">
        <div className="bg-primary-orange rounded-2xl py-3 shadow-[0_6px_18px_rgba(0,0,0,0.2)]">
          <div className="text-2xl text-center text-white">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default PageHeaderTitle
