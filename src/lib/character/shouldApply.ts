import { Effect } from '@/db/character/schema'
import { Context } from './types'

export default (effect: Effect, context: Context) => {
  if (!effect.conditions) return true

  return effect.conditions.every(cond => {
    switch (cond.type) {
      case "level_gte":
        return context.level >= cond.value

      case "has_state":
        return context.states?.includes(cond.value)

      case "has_choice":
        return context.selections?.[cond.level]?.[cond.choiceId] === cond.value

      default:
        return true
    }
  })
}