import { Param } from '@blueprints/utils'
import { BlueprintData } from '@/types/blueprint'
import { findEntryNode } from './findEntryNode'

export function getParamsOfBlueprint(bp: BlueprintData): Param[] {
  const entryNode = findEntryNode(bp)

  return entryNode.data.params as Param[]
}
