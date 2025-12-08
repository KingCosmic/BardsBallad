import { SystemType, TypeData } from '@/db/system/schema';
import generateObject from './generateObject';
import { Script } from '@/types/script';

const defaultScript: Script = {
  source: '',
  compiled: '',
  isCorrect: true,
}

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
    case 'script':
      return { ...defaultScript }
    case 'Calculation':
      return {
        _type: 'Calculation',
        isManual: false,
        value: "",
        valueType: 'string',
        script: {
          ...defaultScript
        }
      }
    default:
      const type = types.find(t => t.name === options.type)

      if (!type) return `Type ${options.type} not found.`

      return generateObject(types, type)
  }
}
