import { z } from 'zod';

const versionedResourceSchema = z.object({
  id: z.string({ invalid_type_error: 'id must be a string' }).optional(),
  local_id: z.string({ invalid_type_error: 'local_id must be a string' }).max(73, 'local_id must be 73 characters or less'),
  user_id: z.string(),

  data: z.any(), // TODO: make schemas for each data type, and still do processing on import and upload to verify.
  reference_id: z.string({ invalid_type_error: 'reference_id must be a string' }),
  reference_type: z.enum(['system', 'character']),

  // a random hash, a quick glance at whether or not update conflicts are happening.
  version: z.string().optional(),

  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }),
  deleted_at: z.string().datetime({ offset: true }).nullable().optional(),
})

export type VersionedResource = z.infer<typeof versionedResourceSchema>;

export default versionedResourceSchema