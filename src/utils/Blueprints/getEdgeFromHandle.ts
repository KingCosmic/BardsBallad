import { Edge, } from '@xyflow/react'

export function getEdgeFromHandle(edges: Edge[], handle: any, type: string) {
  if (!edges) return undefined

  if (type === 'output') {
    return edges.find((edge) => edge.type === 'source' && edge.sourceHandle === handle.id)
  } else if (type === 'input') {
    return edges.find((edge) => edge.type === 'target' && edge.targetHandle === handle.id)
  }

  return undefined
}