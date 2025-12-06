import { z } from 'zod';

const versionSchema = z.object({
  id: z.string({ error: 'id must be a string' }).optional(),
  local_id: z.string({ error: 'local_id must be a string' }).max(73, 'local_id must be 73 characters or less'),
  user_id: z.string(),

  data: z.looseObject({}), // make schemas for each data type, and still do processing on import and upload to verify.
  reference_id: z.string({ error: 'reference_id must be a string' }),
  reference_type: z.enum(['system', 'datapack']),

  // a random hash, a quick glance at whether or not update conflicts are happening.
  version: z.string().optional(),

  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }),
  deleted_at: z.string().datetime({ offset: true }).nullable().optional(),
})

export type VersionedResource = z.infer<typeof versionSchema>;

export default versionSchema