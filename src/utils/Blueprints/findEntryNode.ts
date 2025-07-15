import { BlueprintData } from '@/types/blueprint'

export function findEntryNode(bp: BlueprintData) {
  return bp.nodes.find(n => n.type === 'entry')!
}
