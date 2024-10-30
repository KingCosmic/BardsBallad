// import AsyncStorage from '@react-native-async-storage/async-storage'
import { newRidgeState } from 'react-ridge-state'

import { produce } from 'immer'
import getNestedProperty from '../utils/getNestedProperty';
import setNestedProperty from '../utils/setNestedProperty';
import Storage from '../lib/storage';
import { SystemData } from './systems';


// TODO: add support for type checking? like for example let additem check to make sure values are expected types
// should work well since we're shoving json into these things.
// Modifier logic handlers
// TODO: update this type to make sure we have modifiers for ones available in JsonActionType
const modifierHandlers: { [modifier:string]: (cv: any, v: any) => any } = {
  override: (_currentValue: number, value: number) => value,
  add: (currentValue: number, value: number) => currentValue + value,
  subtract: (currentValue: number, value: number) => currentValue - value,
  multiply: (currentValue: number, value: number) => currentValue * value,
  // Add more handlers as needed

  // array only modifiers
  additem: (currentValue: any[], value: any) => [ ...currentValue, value ],
  removeitem: (currentValue: any[], value: string) => currentValue.filter(v => v.name !== value),
}

export type CharacterData = {
  id: string;
  name: string;

  data: { [key:string]: any };

  ownerID: string;
  version: string;
  system: SystemData;
  
  createdAt: string;
  updatedAt: string;
}

export const characterState = newRidgeState<CharacterData | null>(null, {
  onSet: async (char) => {
    if (char === null) return

    try {
      await Storage.set(char.name, char);
    } catch (e) {
      // TODO: show error message to user.
    }
  }
})

export function setCharacter(char: CharacterData | null = null) {
  characterState.set(char)
}

export enum JsonActionType {
  OVERRIDE = 'override',
  ADD = 'add',
  SUBTRACT = 'substract',
  MULTIPLY = 'multiply',

  ADDITEM = 'additem',
  REMOVEITEM = 'removeitem',
  UPDATEITEM = 'updateitem'
}

type JsonAction = {
  name: string;
  type: JsonActionType;
  target: string;
  value: any;
}

export function runJsonAction(action: JsonAction) {
  characterState.set(previous =>
    produce(previous, draft => {
      let targetProperty = getNestedProperty(draft!, action.target)

      // does the target property exist?
      if (targetProperty === undefined) return draft
    
      const handler = modifierHandlers[action.type]
    
      // did we failt to find the handler?
      if (!handler) return draft
    
      const newValue = handler(targetProperty, action.value)
    
      setNestedProperty(draft!, action.target, newValue)
    
      return draft
    })
  )
}