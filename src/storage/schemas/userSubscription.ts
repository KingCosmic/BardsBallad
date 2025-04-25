import { z } from 'zod';

const userSubscriptionSchema = z.object({
  id: z.string({ invalid_type_error: 'id must be a string' }).optional(),
  local_id: z.string({ invalid_type_error: 'local_id must be a string' }).max(73, 'local_id must be 73 characters or less'),

  user_id: z.string({ invalid_type_error: 'user_id must be a string' }),

  resource_type: z.enum(['system', 'character', 'module', 'plugin']),
  resource_id: z.string({ invalid_type_error: 'resource_id must be a string' }),
  subscribedAt: z.string().datetime({ offset: true }),
  version_id: z.string(),
  autoUpdate: z.boolean().optional().default(true),
  pinned: z.boolean().optional().default(false),

  deleted_at: z.string().datetime({ offset: true }).nullable().optional(),
})

export type UserSubscription = z.infer<typeof userSubscriptionSchema>;

export default userSubscriptionSchema