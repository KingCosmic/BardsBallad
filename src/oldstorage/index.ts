import { addRxPlugin, createRxDatabase, RxDatabase, RxCollection } from 'rxdb/plugins/core'
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv'
import { RxDBUpdatePlugin } from 'rxdb/plugins/update'
import { BehaviorSubject } from 'rxjs'

import { replicateRxCollection, RxReplicationState } from 'rxdb/plugins/replication'

import systemSchema from './schemas/systems'
import characterSchema from './schemas/character'

import { loadDefaultSystems } from './loadDefaultSystems'

if (process.env.NODE_ENV === 'development') {
  addRxPlugin(RxDBDevModePlugin)
}

addRxPlugin(RxDBUpdatePlugin)

import { getAjv } from 'rxdb/plugins/validate-ajv'; 1
import { pullUpdatesForCharacters, pushUpdatesForCharacters } from '../lib/api'

const ajv = getAjv();

ajv.addFormat('date-time', {
  type: 'string',
  validate: v => true // TODO: Add validation
});

// const originalAddEventListener = window.addEventListener

// window.addEventListener = function (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
//   if (type === 'online') {
//     const wrappedListener = (event: Event) => {
//       console.log('RxDB should resync now')

//       // TODO:(Cosmic) make our check and api call to update synced characters

//       // @ts-ignore
//       listener.call(this, event);
//     }

//     originalAddEventListener.call(this, type, wrappedListener, options);
//   } else {
//     originalAddEventListener.call(this, type, listener, options);
//   }
// }

class Storage {
  private version: string = 'v1'

  private database!: RxDatabase;
  public loading$ = new BehaviorSubject<boolean>(true);

  public collections!: {
    characters: RxCollection<any, {}, {}, {}, any>;
    systems: RxCollection<any, {}, {}, {}, any>;
  }

  public replicationState!: RxReplicationState<unknown, unknown>

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

    this.collections = await this.database.addCollections({
      characters: characterSchema,
      systems: systemSchema
    })

    // this.replicationState = replicateRxCollection({
    //   collection: this.collections.characters,

    //   replicationIdentifier: `replication/${this.version}/characters`,
    //   live: false,

    //   autoStart: false,

    //   push: {
    //     async handler(changeRows) {
    //       return pushUpdatesForCharacters(changeRows)
    //     },
    //     // modifier: (doc: any) => ({})
    //   },
    //   pull: {
    //     async handler(checkpointOrNull, batchSize) {
    //       const data = await pullUpdatesForCharacters(checkpointOrNull as any, batchSize)

    //       console.log(data.documents)

    //       return data
    //     },
    //     modifier: (doc: any) => {
    //       const formattedDoc = {
    //         ...doc,
    //         isDeleted: doc._deleted
    //       }
    //       delete formattedDoc._deleted

    //       return formattedDoc
    //     }
    //   }
    // })

    loadDefaultSystems()

    this.loading$.next(false)
  }

  public get characters() {
    return this.database.characters;
  }

  public get systems() {
    return this.database.systems;
  }

  public get replication() {
    return this.replicationState;
  }

  public async startSync() {
    return await this.replicationState.start()
  }

  public async stopSync() {
    return this.replicationState.pause()
  }

  public async cancelSync() {
    return await this.replicationState.cancel()
  }

  public async removeSync() {
    return await this.replicationState.remove()
  }

  public async reSync() {
    return this.replicationState.reSync()
  }
}

export const database = new Storage()

// @ts-expect-error
window.database = database