import React, { memo } from 'react'

const Footer = () => {
  return (
    <footer className='bg-[#1976d2] flex justify-center items-center p-3 w-full relative text-white'>
      <div className="copyRight">
      Copyright © {new Date().getFullYear()} AboodMokied
      </div>
    </footer>
  )
}

export default memo(Footer);