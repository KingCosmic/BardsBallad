import applyEffect from './applyEffect'
import shouldApply from './shouldApply'
import { Collected, Context } from './types'

export default (base: any, collected: Collected[], context: Context) => {
  const result = structuredClone(base)

  for (const { source, effect } of collected) {
    if (!shouldApply(effect, context)) continue

    applyEffect(result, effect)
  }

  return result
}