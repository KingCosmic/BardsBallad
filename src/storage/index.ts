import Dexie, { EntityTable } from 'dexie';

import { type Character } from './schemas/character'
import { type System } from './schemas/system'
import { loadDefaultSystems } from './loadDefaultSystems';

export const db = new Dexie('bardsballad') as Dexie & {
  characters: EntityTable<Character, 'local_id'>;
  systems: EntityTable<System, 'local_id'>;
};

db.version(1).stores({
  characters: '&local_id, updatedAt, id',
  systems: '&local_id, id',
  // campaigns: '++id, local_id, name, description, createdAt, updatedAt',
  // settings: '++id, local_id, key, value',
});

loadDefaultSystems()