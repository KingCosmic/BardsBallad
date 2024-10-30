


type Options = {
  type: string;
  isArray: boolean;
  min?: number;
  max?: number;
  options?: string[];
  genType?: string;
}

export default function getRandomDataFromType(options:Options) {
  if (options.isArray) return []

  switch (options.type) {
    case 'string':
      return 'Lorem Ipsum'
    case 'textarea':
      return 'Lorem Ipsum Dolor Set'
    case 'number':
      return 1
    case 'boolean':
      return false
    case 'enum':
      return (options.options ? [options.options[0]] : ['undefined options'])
    case 'path':
      return ''
    case 'BasedOfTargetAndType':
      return ''
    default:
      // TODO: do a check over our types to see if we have a custom type that fits.
      return ''
  }
}