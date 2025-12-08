import { z } from 'zod';

const subscriptionSchema = z.object({
  id: z.string({ error: 'id must be a string' }).optional(),

  local_id: z.string({ error: 'local_id must be a string' }).max(73, 'local_id must be 73 characters or less'),
  user_id: z.string({ error: 'user_id must be a string' }),

  resource_type: z.enum(['system', 'theme', 'datapack']),
  resource_id: z.string({ error: 'resource_id must be a string' }),

  version_id: z.string(),
  auto_update: z.boolean().optional().default(true),

  // a random hash, a quick glance at whether or not update conflicts are happening.
  version: z.string().optional(),
  
  subscribed_at: z.iso.datetime({ offset: true }),
  updated_at: z.iso.datetime({ offset: true }),
  deleted_at: z.iso.datetime({ offset: true }).nullable().optional(),
})

export type Subscription = z.infer<typeof subscriptionSchema>;

export default subscriptionSchema