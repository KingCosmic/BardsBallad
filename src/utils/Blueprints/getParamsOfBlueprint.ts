import { Param } from '../../blueprints/utils'
import { BlueprintData } from '../../state/systems'
import { findEntryNode } from './findEntryNode'

export function getParamsOfBlueprint(bp: BlueprintData): Param[] {
  const entryNode = findEntryNode(bp)

  return entryNode.data.params as Param[]
}