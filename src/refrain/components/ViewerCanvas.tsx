import React from 'react'
import type { Block } from '../types'
import { useBlockRegistry } from '../context/BlockRegistryContext'
import { useViewerState } from '../context/ViewerContext'

type ViewerCanvasProps = {
  blocks: Block[]
}

export const ViewerCanvas: React.FC<ViewerCanvasProps> = ({ blocks }) => {
  const registry = useBlockRegistry()
  const { state, updateState } = useViewerState()

  return (
    <>
      {blocks.map((block) => {
        const def = registry.byType[block.type]
        if (!def || !def.Preview) {
          return <p key={block.id} className='text-destructive text-sm'>Unknown block: {block.type}</p>
        }
        return <def.Preview key={block.id} props={block.props} state={state} updateState={updateState} />
      })}
    </>
  )
}
