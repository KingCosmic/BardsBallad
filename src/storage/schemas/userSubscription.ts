import { z } from 'zod';

const userSubscriptionSchema = z.object({
  id: z.string({ invalid_type_error: 'id must be a string' }).optional(),

  local_id: z.string({ invalid_type_error: 'local_id must be a string' }).max(73, 'local_id must be 73 characters or less'),
  user_id: z.string({ invalid_type_error: 'user_id must be a string' }),

  resource_type: z.enum(['system', 'theme', 'datapack']),
  resource_id: z.string({ invalid_type_error: 'resource_id must be a string' }),

  version_id: z.string(),
  auto_update: z.boolean().optional().default(true),

  // a random hash, a quick glance at whether or not update conflicts are happening.
  version: z.string().optional(),
  
  subscribed_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }),
  deleted_at: z.string().datetime({ offset: true }).nullable().optional(),
})

export type UserSubscription = z.infer<typeof userSubscriptionSchema>;

export default userSubscriptionSchema