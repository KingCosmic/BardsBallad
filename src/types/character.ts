import { SystemData } from './system'

export interface CharacterData {
  id: string
  name: string
  data: { [key: string]: any }
  ownerID: string
  system: Pick<SystemData, 'id' | 'name' | 'version'>
  createdAt: string
  updatedAt: string
} 