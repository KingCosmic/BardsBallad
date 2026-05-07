import { Character } from "@/db/character/schema";
import { ProgressionSource } from "@/modals/creation/character-creator/testData";

type ResolvedChoice = {
  id: string;
  label: string;
  options: {
    id: string;
    label: string;
    selected: boolean;
    disabled: boolean;
  }[];
  select: { min: number; max: number };
};

export function resolveAvailableChoices(
  character: Character,
  sources: ProgressionSource[],
): ResolvedChoice[] {
  const result: ResolvedChoice[] = [];

  for (const source of sources) {
    const state = character.progression[source.id];

    if (!state) continue;

    if (source.track.type === "step-based") {
      const step = state.step ?? 0;

      for (const s of source.track.steps) {
        if (s.step > step) continue;

        for (const group of s.choices ?? []) {
          result.push({
            id: group.id,
            label: group.label,
            select: group.select ?? { min: 1, max: 1 },
            options: group.options.map((opt) => ({
              id: opt.id,
              label: opt.label,
              selected:
                character.selections[s.step][group.id]?.includes(opt.id) ??
                false,
              disabled: false, // hook requirements later
            })),
          });
        }
      }
    }
  }

  return result;
}
