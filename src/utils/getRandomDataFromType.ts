import { getDefaultNodes } from '@blueprints/utils';
import generateObject from './generateObject';

import { type SystemType, type TypeData } from '@storage/schemas/system'

export default function getRandomDataFromType(types: SystemType[], options: TypeData): any {
  if (options.isArray) return []

  switch (options.type) {
    case 'string':
      return 'Lorem Ipsum'
    case 'number':
      return 1
    case 'boolean':
      return false
    case 'enum':
      return (options.options ? [options.options[0]] : ['undefined options'])
    case 'blueprint':
      return { nodes: getDefaultNodes(options.inputs, options.outputType !== 'none' ? { name: 'output', type: options.outputType || 'none', isArray: options.isOutputAnArray || false } : undefined), edges: [] }
    default:
      const type = types.find(t => t.name === options.type)

      if (!type) return `Type ${options.type} not found.`

      return generateObject(types, type)
  }
}
