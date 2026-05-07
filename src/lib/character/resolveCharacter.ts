import { Character } from "@/db/character/schema";
import applyAllEffects from "./applyAllEffects";
import applyOverrides from "./applyOverrides";
import gatherEffects from "./gatherEffects";
import { SystemData } from "@/db/system/schema";

export default (character: Character, system: SystemData) => {
  const effects = gatherEffects(character, system);

  const computed = applyAllEffects(character, effects);

  applyOverrides(computed, character.overrides);

  return computed;
};
