import { RxCollectionCreator } from 'rxdb'

// Don't forget to increment the version number on updates.

const characterSchema: RxCollectionCreator = {
  schema: {
    version: 0,
    primaryKey: 'local_id',
    type: 'object',
    properties: {
      id: {
        type: 'string',
      },

      local_id: {
        type: 'string',
        maxLength: 73
      },

      name: {
        type: 'string',
      },

      data: { type: 'object' },

      system: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          version: { type: 'string' }
        }
      },

      createdAt: {
        type: 'string',
        format: 'date-time'
      },
      updatedAt: {
        type: 'string',
        format: 'date-time'
      }
    },
    required: [
      'local_id', 'name', 'data', 'system', 'createdAt', 'updatedAt'
    ],
  }
}


export default characterSchema