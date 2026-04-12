import React from 'react'

export const InsertButton: React.FC<{
  onOpen: () => void
  rowClassName?: string
  buttonClassName?: string
}> = ({ onOpen, rowClassName, buttonClassName }) => {
  return (
    <div className={`flex justify-center my-3 ${rowClassName ?? ''}`}>
      <button
        className={`flex flex-row items-center gap-2 border border-indigo-500/40 bg-slate-900/80 text-indigo-100 rounded-full px-4 py-2 cursor-pointer hover:border-indigo-400/60 hover:shadow-[0_10px_30px_rgba(99,102,241,0.25)] hover:-translate-y-0.5 transition-all duration-150 ${buttonClassName ?? ''}`}
        onClick={onOpen}
        aria-label="Insert block"
      >
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/30 border border-indigo-500/40 text-sm font-semibold">+</span>
        <span className="text-sm font-medium">Add block</span>
      </button>
    </div>
  )
}
