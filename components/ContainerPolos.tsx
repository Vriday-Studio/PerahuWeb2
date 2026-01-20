import React from 'react'
export const ContainerBGImage = () => (
  <div className="pointer-events-none absolute inset-0 bg-primary-dark" />
)

export const Container = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <div className="bg-primary-dark text-white w-full max-w-screen relative z-10 overflow-hidden">
      <ContainerBGImage />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
