import { RxCollectionCreator } from 'rxdb'

// Don't forget to increment the version number on updates.

// {
//   id: string;
//   name: string;

//   data: { [key:string]: any };

//   ownerID: string;
//   version: string;
//   system: SystemData;
  
//   createdAt: string;
//   updatedAt: string;
// }

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
      version: {
        type: 'string'
      },

      system: {
        type: 'object',
        properties: {
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
    required: ['id', 'name', 'data', 'ownerID', 'version', 'system', 'createdAt', 'updatedAt']
  }
}

export default characterSchema