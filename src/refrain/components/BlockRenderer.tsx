import React from 'react'
import type { Block } from '../types'
import { useBlockRegistry } from '../context/BlockRegistryContext'

export const BlockRenderer: React.FC<{
  block: Block
  onChange: (updatedProps: Record<string, any>) => void
}> = ({ block, onChange }) => {
  const { byType } = useBlockRegistry()
  const def = byType[block.type]
  if (!def) return null
  const Render = def.Render
  return <Render props={block.props} onChange={onChange} />
}
