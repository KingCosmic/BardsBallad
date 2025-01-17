import { BlueprintData } from '../../state/systems'

export function findEntryNode(bp: BlueprintData) {
  return bp.nodes.find(n => n.type === 'entry')!
}