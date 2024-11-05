import { newRidgeState } from 'react-ridge-state'

import { SystemData } from './systems'

import { produce } from 'immer'

export const systemState = newRidgeState<SystemData | null>(null)

export function setSystem(char: SystemData | null = null) {
  systemState.set(char)
}