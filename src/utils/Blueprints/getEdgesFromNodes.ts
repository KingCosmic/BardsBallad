import { Edge, Node } from '@xyflow/react'

export function getEdgesFromNode(edges: Edge[], node: Node, type: string) {
  if (!edges) return null

  if (type === 'output') {
    return edges.filter((edge) => edge.type === 'source' && edge.target === node.id)
  } else if (type === 'input') {
    return edges.filter((edge) => edge.type === 'target' && edge.source === node.id)
  }

  return null
}