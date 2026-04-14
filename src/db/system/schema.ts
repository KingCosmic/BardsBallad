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

export const dataTypeSchema = z.object({
  name: z.string(),
  typeData: typeDataSchema,
  data: z.any()
})

const pageDataSchema = z.object({
  name: z.string(),
  script: z.string(),
  lexical: z.string(),
  state: z.array(z.object({
    name: z.string(),
    type: typeDataSchema,
    value: z.any()
  }))
})

export const systemTypeSchema = z.object({
  name: z.string(),
  properties: z.array(z.object({
    key: z.string(),
    typeData: typeDataSchema,
  }))
})

const actionSchema = z.object({
  name: z.string(),
  description: z.string(),
  script: z.any()
})

const systemDataSchema = z.object({
  name: z.string(),

  creator: z.array(pageDataSchema),

  modals: z.array(pageDataSchema),

  pages: z.array(pageDataSchema),

  version: z.string(),
  data: z.array(dataTypeSchema),

  defaultCharacterData: z.any(),

  types: z.array(systemTypeSchema),

  actions: z.array(actionSchema),
})

export type SystemData = z.infer<typeof systemDataSchema>;
export type SystemType = z.infer<typeof systemTypeSchema>;
export type ActionType = z.infer<typeof actionSchema>;
export type TypeData = z.infer<typeof typeDataSchema>;
export type PageData = z.infer<typeof pageDataSchema>;
export type DataType = z.infer<typeof dataTypeSchema>;