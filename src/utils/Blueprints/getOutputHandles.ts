import { Node } from '@xyflow/react'

export function getOutputHandles(node: Node) {
  if (!node.handles) return []

  return node.handles.filter(handle => (handle.type === 'source' && !(handle.id || '').includes('next')))
}