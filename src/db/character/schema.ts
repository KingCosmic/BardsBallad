import { z } from "zod"

// simple path string like "data.stats.strength"
export const PathSchema = z.string().min(1)

export const EffectSchema = z.object({
  type: z.enum(["add", "set", "push", "push_unique"]),
  target: PathSchema,
  value: z.any(),
  conditions: z.array(z.any())
})

export type Effect = z.infer<typeof EffectSchema>;

export const ProgressionSchema = z
  .object({
    level: z.number().int().nonnegative().optional()
  })
  .catchall(z.number())

export const SelectionsSchema = z.record(
  z.string(), // level or step
  z.record(z.string(), z.string()) // choiceId -> optionId
)

export const DataSchema = z.object({}).catchall(z.any())

export const OverridesSchema = z.record(PathSchema, z.any())

const characterSchema = z.object({
  name: z.string(),
  description: z.string().optional(),

  progression: ProgressionSchema,

  selections: SelectionsSchema,

  data: DataSchema,

  states: z.array(z.string()),

  overrides: OverridesSchema,

  // hold the system id this character relies on
  system: z.string(),

  // array of datapack id's this character relies on.
  datapacks: z.array(z.string()),
})

export type Character = z.infer<typeof characterSchema>;

export default characterSchema