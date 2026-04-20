import React, { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import type { BlockType } from '../types'
import { SortableBlock } from './SortableBlock'
import { InsertButton } from './InsertButton'
import { InsertMenu } from './InsertMenu'
import { useEditor } from '../context/EditorContext'

type EditorCanvasProps = {
  className?: string
  innerClassName?: string
  innerStyle?: React.CSSProperties
  contentClassName?: string
  insertMenuClassName?: string
  insertMenuButtonClassName?: string
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  className,
  innerClassName,
  innerStyle,
  contentClassName,
  insertMenuClassName,
  insertMenuButtonClassName,
}) => {
  const {
    blocks,
    selectedId,
    selectBlock,
    insertBlock,
    moveBlock,
    updateBlockProps,
  } = useEditor()
  const [insertIndex, setInsertIndex] = useState<number | null>(null)

  const handleInsert = (index: number, type: BlockType) => {
    insertBlock(index, type)
    setInsertIndex(null)
  }

  return (
    <div className={className ?? 'max-w-2xl mx-auto px-6 py-8'}>
      <div className={`flex flex-col ${innerClassName ?? ''}`} style={innerStyle}>
          <DndProvider backend={HTML5Backend}>
              {blocks.map((block, i) => (
                <React.Fragment key={block.id}>
                  <SortableBlock
                    block={block}
                    onChange={(p) => updateBlockProps(block.id, p)}
                    selected={block.id === selectedId}
                    onSelect={(id) => selectBlock(id)}
                    onMove={moveBlock}
                    contentClassName={contentClassName}
                  />
                  <InsertButton onOpen={() => setInsertIndex(i + 1)} />
                  {insertIndex === i + 1 && (
                    <InsertMenu
                      onSelect={(type) => handleInsert(i + 1, type)}
                      className={insertMenuClassName}
                      buttonClassName={insertMenuButtonClassName}
                    />
                  )}
                </React.Fragment>
              ))}
          </DndProvider>

          {blocks.length === 0 && (
            <>
              <InsertButton onOpen={() => setInsertIndex(0)} />
              {insertIndex === 0 && (
                <InsertMenu
                  onSelect={(type) => handleInsert(0, type)}
                  className={insertMenuClassName}
                  buttonClassName={insertMenuButtonClassName}
                />
              )}
            </>
          )}
      </div>
    </div>
  )
}
