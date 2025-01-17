import { BlueprintData } from '../../state/systems'

export function getNode(bp: BlueprintData, nodeID: string) {
  return bp.nodes.find(n => n.id === nodeID)
}