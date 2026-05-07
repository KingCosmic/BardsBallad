import { z } from "zod";

// simple path string like "data.stats.strength"
export const PathSchema = z.string().min(1);

export const EffectSchema = z.object({
  type: z.enum(["add", "set", "push", "push_unique"]),
  target: PathSchema,
  value: z.any(),
  conditions: z.array(z.any()),
});

export type Effect = z.infer<typeof EffectSchema>;

export const ProgressionSchema = z.record(
  z.string(),
  z.object({
    step: z.number().optional(),
    spentPoints: z.number().optional(),
    unlockedNodes: z.array(z.string()).optional(),
  }),
);

export const SelectionsSchema = z.record(
  z.string(), // level or step
  z.record(z.string(), z.string()), // choiceId -> optionId
);

export const DataSchema = z.object({}).catchall(z.any());

export const OverridesSchema = z.record(PathSchema, z.any());

/* ------------------ Requirements ------------------ */

export const RequirementSchema = z.union([
  z.object({
    type: z.literal("step"),
    sourceId: z.string(),
    min: z.number(),
  }),
  z.object({
    type: z.literal("selection"),
    choiceGroupId: z.string(),
    includes: z.string(),
  }),
  z.object({
    type: z.literal("stat"),
    path: z.string(),
    gte: z.number(),
  }),
]);

export type Requirement = z.infer<typeof RequirementSchema>;

/* ------------------ Choices ------------------ */

export const ChoiceOptionSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    label: z.string(),

    requires: RequirementSchema.array().optional(),
    grants: EffectSchema.array().optional(),

    progression: ProgressionTrackSchema.optional(),
  }),
);

export const ChoiceGroupSchema = z.object({
  id: z.string(),
  label: z.string(),

  select: z.object({
    min: z.number(),
    max: z.number(),
  }),

  options: ChoiceOptionSchema.array(),
});

export type ChoiceGroup = z.infer<typeof ChoiceGroupSchema>;

/* ------------------ Progression ------------------ */

export const ProgressionStepSchema = z.object({
  step: z.number(),

  grants: EffectSchema.array().optional(),
  choices: ChoiceGroupSchema.array().optional(),
});

export const ProgressionNodeSchema = z.object({
  id: z.string(),

  cost: z.number().optional(),
  requires: RequirementSchema.array().optional(),

  grants: EffectSchema.array().optional(),
  choices: ChoiceGroupSchema.array().optional(),
});

export const ProgressionTrackSchema: z.ZodType<any> = z.lazy(() =>
  z.union([
    z.object({
      type: z.literal("step-based"),
      steps: ProgressionStepSchema.array(),
    }),
    z.object({
      type: z.literal("point-based"),
      pool: z.object({
        resource: z.string(),
        max: z.number(),
      }),
      nodes: ProgressionNodeSchema.array(),
    }),
  ]),
);

/* ------------------ Source ------------------ */

export const ProgressionSourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  track: ProgressionTrackSchema,
});

export type ProgressionSource = z.infer<typeof ProgressionSourceSchema>;

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
});

export type Character = z.infer<typeof characterSchema>;

export default characterSchema;
