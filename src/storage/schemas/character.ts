import { z } from 'zod';

const characterSchema = z.object({
  // server generated id, mostly shows if this data was ever synced to begin with.
  id: z.string({ invalid_type_error: 'id must be a string' }).optional(),

  // local id generate client side
  local_id: z.string({ invalid_type_error: 'local_id must be a string' }).max(73, 'local_id must be 73 characters or less'),

  // id of the user who created this character
  user_id: z.string({ invalid_type_error: 'user_id must be a string' }),

  // character name
  name: z.string(),

  // all character data.
  data: z.object({}),

  // hold the system and version id this character relies on
  system: z.object({
    local_id: z.string(),
    version_id: z.string()
  }),

  // a random hash, a quick glance at whether or not update conflicts are happening.
  version: z.string().optional(),

  // some time stamps to keep track of actions.
  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }),
  deleted_at: z.string().datetime({ offset: true }).optional(),
})

export type Character = z.infer<typeof characterSchema>;

export default characterSchema