import Dexie, { EntityTable } from 'dexie';

import { type Character } from './schemas/character'
import { type System } from './schemas/system'
import { type UserSubscription } from './schemas/userSubscription'
import { loadDefaultSystems } from './loadDefaultSystems';
import { VersionedResource } from './schemas/versionedResource';

export const db = new Dexie('bardsballad') as Dexie & {
  characters: EntityTable<Character, 'local_id'>;
  systems: EntityTable<System, 'local_id'>;
  subscriptions: EntityTable<UserSubscription, 'local_id'>;
  versions: EntityTable<VersionedResource, 'local_id'>;
};

db.version(1).stores({
  characters: '&local_id, updatedAt, id',
  systems: '&local_id, id',
  subscriptions: '&local_id, user_id, resource_id, version_id',
  versions: '&local_id, reference_id',
  // campaigns: '++id, local_id, name, description, createdAt, updatedAt',
});

loadDefaultSystems()