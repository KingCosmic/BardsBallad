import { BlueprintData } from '@/types/blueprint'

export function getEdge(bp: BlueprintData, edgeID: string) {
  return bp.edges.find(e => e.id === edgeID)
}
