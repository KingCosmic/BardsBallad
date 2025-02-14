import { RxCollectionCreator } from 'rxdb'

// Don't forget to increment the version number on updates.

const systemSchema: RxCollectionCreator = {
  schema: {
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {

    },
    required: ['id', 'name']
  }
}

export default systemSchema