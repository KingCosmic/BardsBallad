import { Node } from '@xyflow/react'

export function getNextHandle(node: Node) {
  if (!node.handles) return null

  return node.handles.filter(handle => (handle.type === 'source' && !(handle.id || '').includes('next')))[0]
}