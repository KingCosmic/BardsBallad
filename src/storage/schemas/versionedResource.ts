import { z } from 'zod';

const versionedResourceSchema = z.object({
  id: z.string({ invalid_type_error: 'id must be a string' }).optional(),
  local_id: z.string({ invalid_type_error: 'local_id must be a string' }).max(73, 'local_id must be 73 characters or less'),

  version: z.string({ invalid_type_error: 'version must be a string' }),
  data: z.object({}),
  reference_id: z.string({ invalid_type_error: 'reference_id must be a string' }),
  reference_type: z.enum(['system', 'character', 'module', 'plugin']),

  deleted_at: z.string().datetime({ offset: true }).nullable().optional(),
})

export type VersionedResource = z.infer<typeof versionedResourceSchema>;

export default versionedResourceSchema