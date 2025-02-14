import { BlueprintData } from '../../state/systems'

export function getReturnTypeOfBlueprint(bp: BlueprintData): string {
  const outputNode = bp.nodes.find(n => n.type === 'output')!

  return outputNode.data.inputType as string
}