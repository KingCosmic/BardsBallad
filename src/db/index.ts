import Dexie, { EntityTable } from 'dexie'

import * as Automerge from '@automerge/automerge'

import { Item } from './shared/schema'

export const db = new Dexie('bardsballad') as Dexie & {
  docs: EntityTable<Item, 'local_id'>
  logs: EntityTable<{ local_id: string, changes: Automerge.Change[], last_synced_change: bigint }, 'local_id'>

  typeHashes: EntityTable<{ local_id: string, hashes: { name: string, hash: string }[] }, 'local_id'>;
};

db.version(1).stores({
  docs: 'local_id, owner_id, namespace, type',

  typeHashes: 'local_id',
});