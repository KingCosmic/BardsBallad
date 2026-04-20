import React from 'react'

export const InsertButton: React.FC<{
  onOpen: () => void
  rowClassName?: string
  buttonClassName?: string
}> = ({ onOpen }) => {
  return (
    <div className='group/insert relative h-4 flex items-center justify-center'>
      <div className='absolute inset-x-0 h-px bg-transparent group-hover/insert:bg-indigo-400/50 transition-colors duration-100' />
      <button
        className='opacity-0 group-hover/insert:opacity-100 relative z-10 w-4 h-4 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center transition-all duration-100 hover:bg-indigo-400 hover:scale-110'
        onClick={onOpen}
        aria-label='Insert block'
      >
        +
      </button>
    </div>
  )
}
