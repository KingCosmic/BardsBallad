import { z } from 'zod';

const characterSchema = z.object({
  // server generated id, mostly shows if this data was ever synced to begin with.
  id: z.string({ error: 'id must be a string' }).optional(),

  // local id generate client side
  local_id: z.string({ error: 'local_id must be a string' }).max(73, 'local_id must be 73 characters or less'),

  // id of the user who created this character
  user_id: z.string({ error: 'user_id must be a string' }),

  // character name
  name: z.string(),

  // all character data.
  data: z.instanceof(Uint8Array<ArrayBufferLike>), // Uint8Array

  // hold the system and version id this character relies on
  system: z.string(),

  datapacks: z.array(z.object({ pack_id: z.string(), version_id: z.string() })),
})

export type CompressedCharacter = z.infer<typeof characterSchema>;
export type Character = Omit<CompressedCharacter, 'data'> & { data: Record<string, any> }

export default characterSchema