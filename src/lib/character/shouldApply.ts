import { Character, Effect } from "@/db/character/schema";

export default (effect: Effect, context: Character) => {
  if (!effect.conditions) return true;

  return effect.conditions.every((cond) => {
    switch (cond.type) {
      case "level_gte":
        return (context.progression.level ?? 0) >= cond.value;

      case "has_state":
        return context.states?.includes(cond.value);

      case "has_choice":
        return context.selections?.[cond.level]?.[cond.choiceId] === cond.value;

      default:
        return true;
    }
  });
};
