import { addRxPlugin, createRxDatabase, RxDatabase } from 'rxdb/plugins/core'
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv'
import { RxDBUpdatePlugin } from 'rxdb/plugins/update'
import { BehaviorSubject } from 'rxjs'

import { replicateRxCollection } from 'rxdb/plugins/replication'

import systemSchema from './schemas/systems'
import characterSchema from './schemas/character'

import { loadDefaultSystems } from './loadDefaultSystems'

if (process.env.NODE_ENV === 'development') {
  addRxPlugin(RxDBDevModePlugin)
}

addRxPlugin(RxDBUpdatePlugin)

import { getAjv } from 'rxdb/plugins/validate-ajv';
import { pullUpdatesForCharacters, pushUpdatesForCharacters } from '../lib/api'

const ajv = getAjv();

ajv.addFormat('date-time', {
  type: 'string',
  validate: v => true // TODO: Add validation
});

class Storage {
  private database!: RxDatabase;
  public loading$ = new BehaviorSubject<boolean>(true);

  constructor() {
    this.initialize();
  }

  private async initialize() {
    this.database = await createRxDatabase({
      name: 'bardsballad',
      storage: wrappedValidateAjvStorage({
        storage: getRxStorageDexie()
      })
    })

    const replicationState = await replicateRxCollection({
      collection: characterSchema,
      replicationIdentifier: 'my-http-replication',
      push: {
        async handler(changeRows) {
          return pushUpdatesForCharacters(changeRows)
        }
      },
      pull: {
        async handler(checkpointOrNull, batchSize) {
          const data = await pullUpdatesForCharacters(checkpointOrNull as any, batchSize)

          return {
            documents: data.documents,
            checkpoint: data.checkpoint
          }
        }
      }
    })

    await this.database.addCollections({
      characters: characterSchema,
      systems: systemSchema
    })

    loadDefaultSystems()

    this.loading$.next(false)
  }

  public get characters() {
    return this.database.characters;
  }

  public get systems() {
    return this.database.systems;
  }
}

export const database = new Storage()