import React, { createContext, useContext, useMemo } from 'react'
import type { Block } from '../types'

export type BlockDefinition = {
  type: string
  label: string
  defaultProps: () => Record<string, any>
  Render: React.FC<{ props: Record<string, any>; onChange: (props: Record<string, any>) => void }>
  Settings?: React.FC<{ props: Record<string, any>; onChange: (props: Record<string, any>) => void }>
  Preview?: React.FC<{ props: Record<string, any>; state: any; updateState: (changes: any) => void }>
}

export type BlockRegistryValue = {
  definitions: BlockDefinition[]
  byType: Record<string, BlockDefinition>
}

const BlockRegistryContext = createContext<BlockRegistryValue | null>(null)

export const BlockRegistryProvider: React.FC<{
  definitions: BlockDefinition[]
  children: React.ReactNode
}> = ({ definitions, children }) => {
  const value = useMemo(() => {
    const byType: Record<string, BlockDefinition> = {}
    definitions.forEach((def) => {
      byType[def.type] = def
    })
    return { definitions, byType }
  }, [definitions])

  return <BlockRegistryContext.Provider value={value}>{children}</BlockRegistryContext.Provider>
}

export const useBlockRegistry = (): BlockRegistryValue => {
  const ctx = useContext(BlockRegistryContext)
  if (!ctx) throw new Error('useBlockRegistry must be used within BlockRegistryProvider')
  return ctx
}

export const resolveBlockDefaults = (type: string, registry: BlockRegistryValue): Record<string, any> => {
  const def = registry.byType[type]
  return def ? def.defaultProps() : {}
}

export const resolveRenderer = (
  block: Block,
  registry: BlockRegistryValue
): React.FC<{ props: Record<string, any>; onChange: (props: Record<string, any>) => void }> | null => {
  return registry.byType[block.type]?.Render ?? null
}

export const resolveSettings = (
  block: Block,
  registry: BlockRegistryValue
): React.FC<{ props: Record<string, any>; onChange: (props: Record<string, any>) => void }> | null => {
  return registry.byType[block.type]?.Settings ?? null
}
