import React from 'react'
import { useDrag, useDrop } from 'react-dnd'
import type { Block } from '../types'
import { BlockRenderer } from './BlockRenderer'

export const SortableBlock: React.FC<{
  block: Block
  onChange: (updatedProps: Record<string, any>) => void
  selected: boolean
  onSelect: (id: string) => void
  onMove: (activeId: string, overId: string) => void
  className?: string
  baseClassName?: string
  selectedClassName?: string
  unselectedClassName?: string
  handleClassName?: string
  contentClassName?: string
}> = ({
  block,
  onChange,
  selected,
  onSelect,
  onMove,
  className,
  baseClassName,
  selectedClassName,
  unselectedClassName,
  handleClassName,
  contentClassName,
}) => {
  const [{ isDragging }, dragRef, previewRef] = useDrag(
    () => ({
      type: 'REFRAIN_BLOCK',
      item: { id: block.id },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [block.id]
  )

  const [, dropRef] = useDrop(
    () => ({
      accept: 'REFRAIN_BLOCK',
      hover: (item: { id: string }) => {
        if (item.id === block.id) return
        onMove(item.id, block.id)
        item.id = block.id
      },
    }),
    [block.id, onMove]
  )

  return (
    <div
      ref={(node) => {
        previewRef(node)
        dropRef(node)
      }}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      data-selected={selected}
      className={`group flex items-start gap-3 border rounded-xl p-3 bg-slate-950/80 backdrop-blur transition-all duration-150 ${
        baseClassName ?? className ?? ''
      } ${
        selected
          ? selectedClassName ?? 'border-indigo-400/70 ring-2 ring-indigo-500/30 shadow-[0_10px_40px_rgba(99,102,241,0.15)]'
          : unselectedClassName ?? 'border-slate-800/80 hover:border-slate-600/80 hover:shadow-[0_10px_30px_rgba(15,23,42,0.35)]'
      }`}
      onClick={() => onSelect(block.id)}
    >
      <button
        ref={dragRef}
        className={`mt-0.5 cursor-grab active:cursor-grabbing select-none flex items-center justify-center w-10 h-10 border border-slate-700 bg-slate-900/90 text-slate-100 rounded-lg transition-all duration-150 hover:border-slate-500 hover:bg-slate-800/90 active:scale-95 shadow-sm ${handleClassName ?? ''}`}
        aria-label="Drag handle"
      >
        <span className="text-base leading-none">::</span>
      </button>
      <div className={`flex-1 ${contentClassName ?? ''}`}>
        <BlockRenderer block={block} onChange={onChange} />
      </div>
    </div>
  )
}
