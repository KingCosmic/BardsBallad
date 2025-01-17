import { BlueprintData } from '../../state/systems'

export function getReturnTypeOfBlueprint(bp: BlueprintData) {
  const outputNode = bp.nodes.find(n => n.type === 'output')!

  return outputNode.data.inputType
}