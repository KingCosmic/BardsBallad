import { z } from 'zod';

const characterSchema = z.object({
  id: z.string({ invalid_type_error: 'id must be a string' }).optional(),

  local_id: z.string({ invalid_type_error: 'local_id must be a string' }).max(73, 'local_id must be 73 characters or less'),

  user_id: z.string({ invalid_type_error: 'user_id must be a string' }),

  name: z.string(),

  data: z.object({}),

  system: z.object({
    local_id: z.string(),
    version_id: z.string()
  }),

  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }),
  deleted_at: z.string().datetime({ offset: true }).optional(),
})

export type Character = z.infer<typeof characterSchema>;

export default characterSchema