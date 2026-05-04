import React from 'react'
import { useDrag, useDrop } from 'react-dnd'
import type { Block } from '../types'
import { BlockRenderer } from './BlockRenderer'

const SortableBlockImpl: React.FC<{
  block: Block
  selected: boolean
  onSelect: (id: string) => void
  onMove: (activeId: string, overId: string) => void
  onUpdateProps: (id: string, props: Record<string, any>) => void
  onDelete: (id: string) => void
  contentClassName?: string
}> = ({
  block,
  selected,
  onSelect,
  onMove,
  onUpdateProps,
  onDelete,
  contentClassName,
}) => {
  const lastHoverKeyRef = React.useRef<string | null>(null)

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

  React.useEffect(() => {
    if (!isDragging) lastHoverKeyRef.current = null
  }, [isDragging])

  const [, dropRef] = useDrop(
    () => ({
      accept: 'REFRAIN_BLOCK',
      hover: (item: { id: string }) => {
        if (item.id === block.id) return
        const moveKey = `${item.id}->${block.id}`
        if (lastHoverKeyRef.current === moveKey) return
        lastHoverKeyRef.current = moveKey
        onMove(item.id, block.id)
      },
    }),
    [block.id, onMove]
  )

  const handleChange = React.useCallback(
    (updatedProps: Record<string, any>) => onUpdateProps(block.id, updatedProps),
    [onUpdateProps, block.id]
  )

  const handleDelete = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      onDelete(block.id)
    },
    [onDelete, block.id]
  )

  return (
    <div
      ref={(node) => { previewRef(node); dropRef(node) }}
      style={{ opacity: isDragging ? 0.3 : 1, position: 'relative' }}
      className='group/block'
      onClick={(e) => { e.stopPropagation(); onSelect(block.id) }}
    >
      {/* Block content renders naturally — no wrapper styling */}
      <div className={contentClassName ?? ''}>
        <BlockRenderer block={block} onChange={handleChange} />
      </div>

      {/* Selection / hover ring overlay — doesn't affect layout */}
      <div
        className={`pointer-events-none absolute inset-0 rounded transition-all duration-100 ${
          selected
            ? 'ring-2 ring-inset ring-indigo-400/80'
            : 'group-hover/block:ring-1 group-hover/block:ring-inset group-hover/block:ring-slate-400/40'
        }`}
      />

      {/* Floating toolbar — appears above the block on hover/select */}
      <div
        className={`absolute -top-6 right-0 flex items-center gap-1 transition-opacity duration-100 z-20 ${
          selected ? 'opacity-100' : 'opacity-0 group-hover/block:opacity-100'
        }`}
      >
        <span className='text-[10px] text-muted-foreground bg-background/90 px-1.5 py-0.5 rounded-sm border border-border capitalize'>
          {block.type}
        </span>
        <button
          ref={dragRef}
          title='Drag to reorder'
          className='cursor-grab active:cursor-grabbing w-5 h-5 flex items-center justify-center rounded bg-background/90 border border-border text-muted-foreground hover:text-foreground transition-colors'
          onClick={(e) => e.stopPropagation()}
        >
          <svg width='10' height='10' viewBox='0 0 10 10' fill='currentColor'>
            <circle cx='2.5' cy='2.5' r='1' />
            <circle cx='7.5' cy='2.5' r='1' />
            <circle cx='2.5' cy='5' r='1' />
            <circle cx='7.5' cy='5' r='1' />
            <circle cx='2.5' cy='7.5' r='1' />
            <circle cx='7.5' cy='7.5' r='1' />
          </svg>
        </button>
        <button
          title='Delete block'
          className='w-5 h-5 flex items-center justify-center rounded bg-background/90 border border-border text-muted-foreground hover:text-destructive transition-colors text-xs'
          onClick={handleDelete}
        >
          ×
        </button>
      </div>
    </div>
  )
}

export const SortableBlock = React.memo(SortableBlockImpl)
