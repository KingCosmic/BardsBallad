import { Character } from "@/db/character/schema";
import applyEffect from "./applyEffect";
import shouldApply from "./shouldApply";
import { Collected, Context } from "./types";

export default (char: Character, collected: Collected[]) => {
  const result = structuredClone(char.data);

  for (const { effect } of collected) {
    if (!shouldApply(effect, char)) continue;

    applyEffect(result, effect);
  }

  return result;
};
