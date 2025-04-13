import { RxCollectionCreator } from 'rxdb'

// Don't forget to increment the version number on updates.

const systemSchema: RxCollectionCreator = {
  schema: {
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
      id: {
        type: 'string',
        maxLength: 100
      },
      name: {
        type: 'string'
      },
      creator: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            blueprint: { type: 'object' },
            lexical: { type: 'string' },
            state: { type: 'array' }
          }
        }
      },
      modals: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            blueprint: { type: 'object' },
            lexical: { type: 'string' },
            state: { type: 'array' }
          }
        }
      },
      pages: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            blueprint: { type: 'object' },
            lexical: { type: 'string' },
            state: { type: 'array' }
          }
        }
      },
      version: { type: 'string' },
      data: { type: 'array' },
      defaultCharacterData: { type: 'object' },
      types: { type: 'array' }
    },
    required: ['id', 'name', 'version']
  }
}

export default systemSchema