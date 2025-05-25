import { BlueprintData } from '@/types/blueprint'

export function getNode(bp: BlueprintData, nodeID: string) {
  return bp.nodes.find(n => n.id === nodeID)
}
