import React from 'react'
import { useBlockRegistry } from '../context/BlockRegistryContext'

export const InsertMenu: React.FC<{
  onSelect: (type: string) => void
  className?: string
  buttonClassName?: string
}> = ({ onSelect, className, buttonClassName }) => {
  const { definitions } = useBlockRegistry()
  return (
    <div
      className={`flex gap-2 p-2 border border-slate-800 bg-slate-900 text-slate-100 rounded-lg shadow-lg ${className ?? ''}`}
      role="menu"
      aria-label="Insert block type"
    >
      {definitions.map((def) => (
        <button
          key={def.type}
          onClick={() => onSelect(def.type)}
          className={`px-3 py-2 bg-slate-800 border border-slate-700 rounded hover:bg-slate-700 transition-colors text-sm text-slate-100 ${buttonClassName ?? ''}`}
        >
          {def.label}
        </button>
      ))}
    </div>
  )
}
