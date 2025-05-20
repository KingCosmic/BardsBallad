import { z } from 'zod';

const typeDataSchema = z.object({
  type: z.string(),
  gen: z.any().optional(), // Adjust as needed
  useTextArea: z.boolean().optional(),
  isArray: z.boolean().optional(),
  options: z.array(z.string()).optional(),
  outputType: z.string().optional(),
  isOutputAnArray: z.boolean().optional(),
  inputs: z.array(z.any()).optional()
})

const dataType = z.object({
  name: z.string(),
  typeData: typeDataSchema,
  data: z.any()
})

const pageDataSchema = z.object({
  name: z.string(),
  blueprint: z.object({
    nodes: z.array(z.any()),
    edges: z.array(z.any())
  }),
  lexical: z.string(),
  state: z.array(z.object({
    name: z.string(),
    type: typeDataSchema,
    value: z.any()
  }))
})

const systemTypeSchema = z.object({
  name: z.string(),
  properties: z.array(z.object({
    key: z.string(),
    typeData: typeDataSchema,
  }))
})

const systemDataSchema = z.object({
  creator: z.array(pageDataSchema),

  modals: z.array(pageDataSchema),

  pages: z.array(pageDataSchema),

  version: z.string(),
  data: z.array(dataType),

  defaultCharacterData: z.any(),

  types: z.array(systemTypeSchema),
})

const systemSchema = z.object({
  id: z.string({ invalid_type_error: 'id must be a string' }).max(100, 'id cannot be longer than 100 characters').optional(),

  local_id: z.string({ invalid_type_error: 'local_id must be a string' }).max(73, 'local_id must be 73 characters or less'),
  user_id: z.string(),

  name: z.string(),

  forked_from: z.string().nullable().optional(),

  // a random hash, a quick glance at whether or not update conflicts are happening.
  version: z.string().optional(),

  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }),

  deleted_at: z.string().datetime({ offset: true }).nullable().optional(),
})

export type SystemData = z.infer<typeof systemDataSchema>;
export type SystemType = z.infer<typeof systemTypeSchema>;
export type TypeData = z.infer<typeof typeDataSchema>;
export type PageData = z.infer<typeof pageDataSchema>;
export type DataType = z.infer<typeof dataType>;
export type System = z.infer<typeof systemSchema>;

export default systemSchema