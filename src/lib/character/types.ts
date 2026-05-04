import { Effect } from '@/db/character/schema'

export type Context = {
  level: number,
  selections: Record<string, Record<string, string>>,
  states: string[]
}

export type Condition = {
  type: string,
  value: any,
  choiceId: number,
  level: number
}

export type Collected = {
  source: string
  effect: Effect
}