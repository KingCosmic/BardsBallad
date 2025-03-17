import { RxCollectionCreator } from 'rxdb'

// Don't forget to increment the version number on updates.

const characterSchema: RxCollectionCreator = {
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
        type: 'string',
      },

      data: { type: 'object' },

      ownerID: {
        type: 'string'
      },

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
    required: ['id', 'name', 'data', 'ownerID', 'system', 'createdAt', 'updatedAt']
  }
}


export default characterSchema