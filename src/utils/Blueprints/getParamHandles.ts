import { Node } from '@xyflow/react'

export function getTargetHandles(node: Node) {
  if (!node.handles) return []

  return node.handles.filter(handle => handle.type === 'target')
}