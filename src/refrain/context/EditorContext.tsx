import React, { createContext, useContext, useMemo, useState } from 'react'
import type { Block, BlockType } from '../types'
import { arrayMove } from '@dnd-kit/sortable'
import { useBlockRegistry, resolveBlockDefaults } from './BlockRegistryContext'

export type EditorContextValue = {
  blocks: Block[]
  selectedId: string | null
  selectedBlock: Block | null
  selectBlock: (id: string | null) => void
  insertBlock: (index: number, type: BlockType) => void
  moveBlock: (activeId: string, overId: string) => void
  updateBlockProps: (id: string, props: Record<string, any>) => void
  deleteBlock: (id: string) => void
}

const EditorContext = createContext<EditorContextValue | null>(null)

export const EditorProvider: React.FC<{
  initialBlocks?: Block[]
  children: React.ReactNode
}> = ({ initialBlocks, children }) => {
  const registry = useBlockRegistry()
  const [blocks, setBlocks] = useState<Block[]>(
    initialBlocks ?? registry.definitions.map((d) => ({
      id: Math.random().toString(36).slice(2),
      type: d.type,
      props: d.defaultProps(),
    }))
  )
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedBlock = useMemo(
    () => blocks.find((b) => b.id === selectedId) ?? null,
    [blocks, selectedId]
  )

  const selectBlock = (id: string | null) => setSelectedId(id)

  const insertBlock = (index: number, type: BlockType) => {
    setBlocks((prev) => {
      const next = [...prev]
      next.splice(index, 0, {
        id: Math.random().toString(36).slice(2),
        type,
        props: resolveBlockDefaults(type, registry),
      })
      return next
    })
    setSelectedId(null)
  }

  const moveBlock = (activeId: string, overId: string) => {
    if (activeId === overId) return
    setBlocks((items) => {
      const oldIndex = items.findIndex((b) => b.id === activeId)
      const newIndex = items.findIndex((b) => b.id === overId)
      if (oldIndex === -1 || newIndex === -1) return items
      return arrayMove(items, oldIndex, newIndex)
    })
  }

  const updateBlockProps = (id: string, props: Record<string, any>) => {
    setBlocks((items) => items.map((b) => (b.id === id ? { ...b, props } : b)))
  }

  const deleteBlock = (id: string) => {
    setBlocks((items) => items.filter((b) => b.id !== id))
    setSelectedId((current) => (current === id ? null : current))
  }

  const value: EditorContextValue = {
    blocks,
    selectedId,
    selectedBlock,
    selectBlock,
    insertBlock,
    moveBlock,
    updateBlockProps,
    deleteBlock,
  }

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
}

const useEditor = (): EditorContextValue => {
  const ctx = useContext(EditorContext)
  if (!ctx) throw new Error('useEditor must be used within EditorProvider')
  return ctx
}

export const useSelected = () => {
  const ctx = useEditor()
  return {
    selectedId: ctx.selectedId,
    selectedBlock: ctx.selectedBlock,
    selectBlock: ctx.selectBlock,
    updateSelectedProps: (props: Record<string, any>) => {
      if (ctx.selectedBlock) ctx.updateBlockProps(ctx.selectedBlock.id, props)
    },
    deleteSelected: () => {
      if (ctx.selectedBlock) ctx.deleteBlock(ctx.selectedBlock.id)
    },
  }
}

export { useEditor }
