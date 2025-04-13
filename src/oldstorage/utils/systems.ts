import { database } from '../index'
import { type System, type TypeData } from '../../newstorage/schemas/system'
import { v4 as uuidv4 } from 'uuid'
import { produce } from 'immer'
import { editorState } from '../../state/editor'

import lz from 'lzutf8'
import { getDefaultNodes } from '../../blueprints/utils'
import { BlueprintData } from '../../types/blueprint'

export async function updateSystem(id: string, updateFn: (draft: System) => void) {
  const doc = await database.systems.findOne(id).exec()
  if (!doc) return

  // Keep trying until update succeeds or definitively fails
  while (true) {
    try {
      const newState = produce(doc.toJSON(), updateFn)
      await doc.incrementalUpdate({
        $set: newState
      })
      console.log(newState)
      break // Success - exit loop
    } catch (err: any) {
      if (err.name === 'RxError' && err.code === 'CONFLICT') {
        // Reload latest doc version and retry
        await doc.getLatest()
        continue
      }
      throw err // Re-throw any other errors
    }
  }
}

export async function getAllSystems() {
  const docs = await database.systems.find().exec()
  return docs.map(doc => doc.toJSON())
}

export async function getSystem(id: string) {
  const doc = await database.systems.findOne(id).exec()
  return doc?.toJSON() || null
}

export async function createSystem(system: Omit<System, 'id'>) {
  return await database.systems.insert({
    id: uuidv4(),
    ...system
  })
}

export async function renameSystem(id: string, newName: string) {
  await updateSystem(id, (draft: System) => {
    draft.name = newName
  })
}

export async function deleteSystem(id: string) {
  const doc = await database.systems.findOne(id).exec()

  if (!doc) return

  // Keep trying until delete succeeds or definitively fails
  while (true) {
    try {
      await doc.remove()
      break // Success - exit loop
    } catch (err: any) {
      if (err.name === 'RxError' && err.code === 'CONFLICT') {
        // Reload latest doc version and retry
        await doc.reload()
        continue
      }
      throw err // Re-throw any other errors
    }
  }
}

export async function setDefaultCharacterData(id: string, data: { [key: string]: any }) {
  await updateSystem(id, (draft: System) => {
    draft.defaultCharacterData = data
  })
}

export async function addCharacterPage() {
  const editor = editorState.get()

  await updateSystem(editor.systemId, (draft: System) => {
    const index = draft.pages.findIndex((data => data.name === 'New Page'))

    if (index !== -1) return

    draft.pages.push({
      name: 'New Page',
      blueprint: { nodes: getDefaultNodes(), edges: [] },
      lexical: '',
      state: []
    })
  })
}

export async function renameCharacterPage(oldName: string, newName: string) {
  const editor = editorState.get() 

  await updateSystem(editor.systemId, (draft: System) => {
    const index = draft.pages.findIndex((data => data.name === oldName))

    if (index === -1) return  

    draft.pages[index].name = newName
  })
}

export async function deleteCharacterPage(name: string) {
  const editor = editorState.get()

  await updateSystem(editor.systemId, (draft: System) => {
    const index = draft.pages.findIndex((data => data.name === name))

    if (index === -1) return

    draft.pages.splice(index, 1)
  })
}

export async function updateCharacterPageBlueprint(blueprint: BlueprintData) {
  const editor = editorState.get()

  await updateSystem(editor.systemId, (draft: System) => {
    const index = draft.pages.findIndex((data => data.name === editor.characterPage))

    if (index === -1) return
    
    draft.pages[index].blueprint = blueprint
  })
}

export async function addCharacterPageState(pageName: string, key: string, type: TypeData) {
  const editor = editorState.get()

  await updateSystem(editor.systemId, (draft: System) => {
    const index = draft.pages.findIndex((data => data.name === pageName))

    if (index === -1) return

    if (draft.pages[index].state.find(state => state.name === key)) return

    draft.pages[index].state.push({
      name: key,
      type,
      value: undefined
    })
  })
}

export async function updateCharacterPageState(pageName: string, oldName: string, state: { name: string, type: TypeData, value: any }) {
  const editor = editorState.get()

  await updateSystem(editor.systemId, (draft: System) => {
    for (let i = 0; i < draft.pages.length; i++) {
      const page = draft.pages[i]

      if (page.name !== pageName) continue

      const index = page.state.findIndex((s => s.name === oldName))

      if (index === -1) return

      if (oldName !== state.name) {
        page.state.splice(index, 1)
        page.state.push(state)
      } else {
        page.state[index] = state
      }
    }
  })
}

export async function addSystemData(id: string) {
  await updateSystem(id, (draft: System) => {
    const index = draft.data.findIndex((data => data.name === 'New Data'))

    if (index !== -1) return

    draft.data.push({
      name: 'New Data',
      typeData: {
        type: 'string',
        options: [],
        isArray: false,
        useTextArea: false,
        inputs: [],
        outputType: 'none',
        isOutputAnArray: false
      },
      data: 'lorem ipsum'
    })
  })
}


export async function updateSystemData(id: string, oldName: string, newData: any) {
  await updateSystem(id, (draft: System) => {
    const index = draft.data.findIndex((data => data.name === oldName))

    if (index === -1) return

    if (oldName !== newData.name) {
      draft.data.splice(index, 1)
      draft.data.push(newData)
    } else {
      draft.data[index] = newData
    }
  })
}

export async function deleteSystemData(id: string, name: string) {
  await updateSystem(id, (draft: System) => {
    const index = draft.data.findIndex((data => data.name === name))

    if (index === -1) return

    draft.data.splice(index, 1)
  })
}

export async function addSystemType(id: string, typeName: string) {
  await updateSystem(id, (draft: System) => {
    draft.types.push({
      name: typeName,
      properties: [
        {
          key: 'newProperty',
          typeData: {
            type: 'string',
            options: [],
            isArray: false,
            useTextArea: false,
            inputs: [],
            outputType: 'none',
            isOutputAnArray: false
          }
        }
      ]
    })
  })
}

export async function renameSystemType(id: string, oldName: string, newName: string) {
  await updateSystem(id, (draft: System) => {
    const index = draft.types.findIndex((type => type.name === oldName))

    if (index === -1) return

    draft.types[index].name = newName
  })
}

export async function deleteSystemType(id: string, typeName: string) {
  await updateSystem(id, (draft: System) => {
    const index = draft.types.findIndex((type => type.name === typeName)) 

    if (index === -1) return

    draft.types.splice(index, 1)
  })
}

export async function addTypeProperty(id: string, typeName: string) {
  let newProperty: {
    key: string;
    typeData: TypeData;
  } = {
    key: 'newProperty',
    typeData: {
      type: 'string',
      options: [],
      isArray: false,
      useTextArea: false,
      inputs: [],
      outputType: 'none',
      isOutputAnArray: false
    }
  }

  await updateSystem(id, (draft: System) => {
    const index = draft.types.findIndex((type => type.name === typeName))

    if (index === -1) return

    draft.types[index].properties.push(newProperty)
  })

  return newProperty
}

export async function updateTypeProperty(id: string, typeName: string, oldKey: string, data: { key: string; typeData: TypeData }) {
  await updateSystem(id, (draft: System) => {
    for (let t = 0; t < draft.types.length; t++) {
      const type = draft.types[t]

      if (type.name !== typeName) continue

      const index = type.properties.findIndex((prop => prop.key === oldKey))

      if (index === -1) return

      if (oldKey !== data.key) {
        type.properties.splice(index, 1)
        type.properties.push(data)
      } else {
        type.properties[index] = data
      }
    }
  })
}

export async function deleteTypeProperty(id: string, typeName: string, key: string) {
  await updateSystem(id, (draft: System) => {
    for (let t = 0; t < draft.types.length; t++) {
      const type = draft.types[t]

      if (type.name !== typeName) continue

      const index = type.properties.findIndex((prop => prop.key === key))

      if (index === -1) return

      type.properties.splice(index, 1)
    }
  })
}

export async function updateLexical(id: string, lexical: string) {
  const editor = editorState.get()

  if (lexical === '{}') return

  const newLexical = lz.encodeBase64(lz.compress(lexical))

  await updateSystem(id, (draft: System) => {
    if (editor.tab === 'editor') {
      const index = draft.pages.findIndex((data => data.name === editor.characterPage))

      if (index === -1) return

      draft.pages[index].lexical = newLexical
    } else if (editor.tab === 'creator') {
      const index = draft.creator.findIndex((data => data.name === editor.creatorPage))

      if (index === -1) return

      draft.creator[index].lexical = newLexical
    }
  })
}

export async function addCreatorPage() {
  const editor = editorState.get()

  await updateSystem(editor.systemId, (draft: System) => {
    const index = draft.creator.findIndex((data => data.name === 'New Page'))

    if (index !== -1) return

    draft.creator.push({
      name: 'New Page',
      blueprint: { nodes: getDefaultNodes(), edges: [] },
      lexical: '',
      state: []
    })
  })
}

export async function renameCreatorPage(oldName: string, newName: string) {
  const editor = editorState.get()

  await updateSystem(editor.systemId, (draft: System) => {
    const index = draft.creator.findIndex((data => data.name === oldName))

    if (index === -1) return  

    draft.creator[index].name = newName
  })
}

export async function deleteCreatorPage(name: string) {
  const editor = editorState.get()

  await updateSystem(editor.systemId, (draft: System) => {
    const index = draft.creator.findIndex((data => data.name === name))

    if (index === -1) return

    draft.creator.splice(index, 1)
  })
}

export async function updateCreatorPageBlueprint(blueprint: BlueprintData) {
  const editor = editorState.get()

  await updateSystem(editor.systemId, (draft: System) => {
    const index = draft.creator.findIndex((data => data.name === editor.creatorPage))

    if (index === -1) return
    
    draft.creator[index].blueprint = blueprint
  })
}

export async function addCreatorPageState(pageName: string, key: string, type: TypeData) {
  const editor = editorState.get()

  await updateSystem(editor.systemId, (draft: System) => {
    const index = draft.creator.findIndex((data => data.name === pageName))

    if (index === -1) return

    if (draft.creator[index].state.find(state => state.name === key)) return

    draft.creator[index].state.push({
      name: key,
      type,
      value: undefined
    })
  })
}

export async function updateCreatorPageState(pageName: string, oldName: string, state: { name: string, type: TypeData, value: any }) {
  const editor = editorState.get()

  await updateSystem(editor.systemId, (draft: System) => {
    for (let i = 0; i < draft.creator.length; i++) {
      const page = draft.creator[i]

      if (page.name !== pageName) continue

      const index = page.state.findIndex((s => s.name === oldName))

      if (index === -1) return

      if (oldName !== state.name) {
        page.state.splice(index, 1)
        page.state.push(state)
      } else {
        page.state[index] = state
      }
    }
  })
}