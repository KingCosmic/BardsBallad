import { addRxPlugin, createRxDatabase } from 'rxdb/plugins/core'
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv'
import systemSchema from './schemas/systems'
import characterSchema from './schemas/character'

addRxPlugin(RxDBDevModePlugin)

const database = await createRxDatabase({
  name: 'bardsballad',
  storage: wrappedValidateAjvStorage({
    storage: getRxStorageDexie()
  })
})

await database.addCollections({
  characters: characterSchema,
  systems: systemSchema
})

export const getAllCharacters = () => {
  return database.characters.find().exec()
}

export const getAllSystems = () => {
  return database.systems.find().exec()
}