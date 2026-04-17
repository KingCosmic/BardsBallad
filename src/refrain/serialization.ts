import type { Block } from './types'
import type { BlockDefinition } from './context/BlockRegistryContext'

export type RefrainDocument = {
  format: 'refrain-v1'
  blocks: Block[]
}

type LegacyNode = {
  type?: string | { resolvedName?: string }
  props?: Record<string, any>
}

const createId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

const isPlainObject = (value: unknown): value is Record<string, any> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const deepEqual = (left: unknown, right: unknown): boolean => {
  if (left === right) return true
  if (Array.isArray(left) && Array.isArray(right)) {
    if (left.length !== right.length) return false
    return left.every((item, index) => deepEqual(item, right[index]))
  }
  if (isPlainObject(left) && isPlainObject(right)) {
    const leftKeys = Object.keys(left)
    const rightKeys = Object.keys(right)
    if (leftKeys.length !== rightKeys.length) return false
    return leftKeys.every((key) => deepEqual(left[key], right[key]))
  }
  return false
}

const deepDiff = (defaults: Record<string, any>, value: Record<string, any>): Record<string, any> => {
  const diff: Record<string, any> = {}
  const keys = new Set([...Object.keys(defaults), ...Object.keys(value)])

  keys.forEach((key) => {
    const currentValue = value[key]
    const defaultValue = defaults[key]

    if (isPlainObject(currentValue) && isPlainObject(defaultValue)) {
      const nestedDiff = deepDiff(defaultValue, currentValue)
      if (Object.keys(nestedDiff).length > 0) diff[key] = nestedDiff
      return
    }

    if (!deepEqual(currentValue, defaultValue)) diff[key] = currentValue
  })

  return diff
}

const deepMerge = (defaults: Record<string, any>, value: Record<string, any>): Record<string, any> => {
  const merged: Record<string, any> = { ...defaults }
  Object.keys(value).forEach((key) => {
    const incoming = value[key]
    const fallback = defaults[key]
    if (isPlainObject(incoming) && isPlainObject(fallback)) {
      merged[key] = deepMerge(fallback, incoming)
      return
    }
    merged[key] = incoming
  })
  return merged
}

export const exportRefrainDocument = (blocks: Block[], definitions: BlockDefinition[]): RefrainDocument => {
  const defaultsByType = definitions.reduce<Record<string, Record<string, any>>>((acc, definition) => {
    acc[definition.type] = definition.defaultProps()
    return acc
  }, {})

  return {
    format: 'refrain-v1',
    blocks: blocks.map((block) => ({
      id: block.id,
      type: block.type,
      props: deepDiff(defaultsByType[block.type] ?? {}, block.props ?? {}),
    })),
  }
}

export const parseRefrainDocument = (raw: unknown, definitions: BlockDefinition[]): Block[] => {
  const defaultsByType = definitions.reduce<Record<string, Record<string, any>>>((acc, definition) => {
    acc[definition.type] = definition.defaultProps()
    return acc
  }, {})

  if (isPlainObject(raw) && raw.format === 'refrain-v1' && Array.isArray(raw.blocks)) {
    return raw.blocks
      .filter((block): block is Block => isPlainObject(block) && typeof block.id === 'string' && typeof block.type === 'string')
      .map((block) => ({
        id: block.id,
        type: block.type,
        props: deepMerge(defaultsByType[block.type] ?? {}, isPlainObject(block.props) ? block.props : {}),
      }))
  }

  if (!isPlainObject(raw) || !isPlainObject(raw.ROOT) || !Array.isArray(raw.ROOT.nodes)) return []

  return raw.ROOT.nodes
    .map((id) => (isPlainObject(raw[id]) ? raw[id] as LegacyNode : null))
    .filter((node): node is LegacyNode => !!node)
    .map((node) => {
      const resolvedType = typeof node.type === 'string' ? node.type : node.type?.resolvedName
      if (resolvedType === 'DesignerDivider') {
        return { type: 'divider', props: {} }
      }
      if (resolvedType !== 'Text') {
        console.warn(`Unsupported legacy node type "${resolvedType ?? 'unknown'}", defaulting to text block`)
      }
      return { type: 'text', props: { text: node.props?.text ?? 'hello world' } }
    })
    .map((block) => ({
      id: createId(),
      type: block.type,
      props: deepMerge(defaultsByType[block.type] ?? {}, block.props),
    }))
}
