import Dexie, { EntityTable } from 'dexie';

import { type Character } from './schemas/character'
import { type UserSubscription } from './schemas/userSubscription'
import { VersionedResource } from './schemas/versionedResource';

import { z } from 'zod';

export const itemSchema = z.object({
  id: z.string({ invalid_type_error: 'id must be a string' }).max(100, 'id cannot be longer than 100 characters').optional(),

  local_id: z.string({ invalid_type_error: 'local_id must be a string' }).max(73, 'local_id must be 73 characters or less'),
  user_id: z.string(),

  name: z.string(),

  forked_from: z.string().nullable().optional(),

  // a random hash, a quick glance at whether or not update conflicts are happening.
  version: z.string().optional(),

  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }),
})

export type Item = z.infer<typeof itemSchema>;

export const db = new Dexie('bardsballad') as Dexie & {
  characters: EntityTable<Character, 'local_id'>;

  systems: EntityTable<Item, 'local_id'>;
  datapacks: EntityTable<Item, 'local_id'>;

  subscriptions: EntityTable<UserSubscription, 'local_id'>;
  versions: EntityTable<VersionedResource, 'local_id'>;

  typeHashes: EntityTable<{ local_id: string, hashes: { name: string, hash: string }[] }, 'local_id'>;
};

db.version(1).stores({
  characters: '&local_id, updatedAt, id',

  systems: '&local_id, id',
  datapacks: '&local_id, id',

  subscriptions: '&local_id, user_id, resource_id, version_id',
  versions: '&local_id, reference_id, id',

  typeHashes: '&local_id',
});