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
  blockClassName?: string
  blockSelectedClassName?: string
  blockUnselectedClassName?: string
  blockHandleClassName?: string
  blockContentClassName?: string
  insertButtonRowClassName?: string
  insertButtonClassName?: string
  insertMenuClassName?: string
  insertMenuButtonClassName?: string
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  className,
  blockClassName,
  blockSelectedClassName,
  blockUnselectedClassName,
  blockHandleClassName,
  blockContentClassName,
  insertButtonRowClassName,
  insertButtonClassName,
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
    <div className={`max-w-4xl mx-auto px-4 my-8 ${className ?? ''}`}>
      <div className="flex flex-col gap-2">
          <DndProvider backend={HTML5Backend}>
              {blocks.map((block, i) => (
                <React.Fragment key={block.id}>
                  <SortableBlock
                    block={block}
                    onChange={(p) => updateBlockProps(block.id, p)}
                    selected={block.id === selectedId}
                    onSelect={(id) => selectBlock(id)}
                    onMove={moveBlock}
                    baseClassName={blockClassName}
                    selectedClassName={blockSelectedClassName}
                    unselectedClassName={blockUnselectedClassName}
                    handleClassName={blockHandleClassName}
                    contentClassName={blockContentClassName}
                  />
                  <InsertButton
                    onOpen={() => setInsertIndex(i + 1)}
                    rowClassName={insertButtonRowClassName}
                    buttonClassName={insertButtonClassName}
                  />
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
            <InsertButton
              onOpen={() => setInsertIndex(0)}
              rowClassName={insertButtonRowClassName}
              buttonClassName={insertButtonClassName}
            />
          )}
          {insertIndex === (blocks.length === 0 ? 0 : null) && blocks.length === 0 && (
            <InsertMenu
              onSelect={(type) => handleInsert(0, type)}
              className={insertMenuClassName}
              buttonClassName={insertMenuButtonClassName}
            />
          )}

          {blocks.length > 0 && insertIndex === null && (
            <div className="insert-row">
              {/* trailing insert row already rendered after each block via InsertButton */}
            </div>
          )}
      </div>
    </div>
  )
}
