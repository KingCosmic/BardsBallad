import { z } from 'zod';

const characterSchema = z.object({
  id: z.string({ invalid_type_error: 'id must be a string' }).optional(),

  local_id: z.string({ invalid_type_error: 'local_id must be a string' }).max(73, 'local_id must be 73 characters or less'),

  user_id: z.string({ invalid_type_error: 'user_id must be a string' }),

  name: z.string(),

  data: z.object({}),

  system: z.object({
    id: z.string(),
    name: z.string(),
    version: z.string()
  }),

  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),

  isDeleted: z.boolean().optional().default(false),
})

export type Character = z.infer<typeof characterSchema>;

export default characterSchema