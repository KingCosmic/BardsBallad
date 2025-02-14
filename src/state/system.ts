import { newRidgeState } from 'react-ridge-state'

import { BlueprintData, DataType, SystemData, TypeData } from './systems'

import { produce } from 'immer'
import { getDefaultNodes } from '../blueprints/utils'
import { EditorState, editorState, setCharacterPage, setCreatorPage } from './editor'

import { SystemStorage } from '../lib/storage'

import lz from 'lzutf8'

let saveTimeout: NodeJS.Timeout | null = null
export const systemState = newRidgeState<SystemData | null>(null, {
  onSet: async (sys) => {
    if (sys === null) return

    if (saveTimeout) clearTimeout(saveTimeout)

    saveTimeout = setTimeout(async () => {
      try {
        console.log(sys)
        await SystemStorage.set(sys.name, sys)
      } catch (e) {
        // TODO: show error message to user.
      }
    }, 5000)
  }
})

export function setSystem(char: SystemData | null = null) {
  systemState.set(char)
}

export function setDefaultCharacterData(newDefaultData: { [key:string]: any }) {
  const system = systemState.get()

  if (!system) return

  const newState = produce(system, (draft) => {
    draft.defaultCharacterData = newDefaultData
  })

  systemState.set(newState)
}

export function updateLexical(lexical: string) {
  const system = systemState.get()
  const editor = editorState.get()

  if (!system || lexical === '{}') return

  switch (editor.tab) {
    case 'editor':
      return updateCharacterLexical(lexical, system, editor)
    case 'creator':
      return updateCreatorLexical(lexical, system, editor)
  }
}

export function updateCreatorPageBlueprint(blueprint: BlueprintData) {
  const system = systemState.get()
  const editor = editorState.get()

  if (!system || !blueprint) return

  const newState = produce(system, (draft) => {
    const index = draft.creator.findIndex((data => data.name === editor.creatorPage))

    if (index === -1) return
    
    draft.creator[index].blueprint = blueprint
  })

  systemState.set(newState)
}

export function updateCreatorLexical(lexical: string, system: SystemData, editor: EditorState) {
  const newState = produce(system, (draft) => {
    const index = draft.creator.findIndex((data => data.name === editor.creatorPage))

    if (index === -1) return
    
    draft.creator[index].lexical = lz.encodeBase64(lz.compress(lexical))
  })

  systemState.set(newState)
}

export function addCreatorPage() {
  const system = systemState.get()

  if (!system) return

  const newState = produce(system, (draft) => {
    const index = draft.creator.findIndex((data => data.name === 'New Page'))

    if (index !== -1) return

    draft.creator.push({
      name: 'New Page',
      blueprint: { nodes: getDefaultNodes([], { name: 'can move on', type: 'boolean', isArray: false }), edges: [] },
      lexical: '',
      state: []
    })
  })

  systemState.set(newState)
}

export function updateCreatorPageName(oldName: string, newName: string) {
  const system = systemState.get()

  if (!system) return

  const newState = produce(system, (draft) => {
    const index = draft.creator.findIndex((data => data.name === oldName))

    if (index === -1) return

    draft.creator[index].name = newName
  })

  systemState.set(newState)
}

export function deleteCreatorPage(name: string) {
  const system = systemState.get()

  if (!system) return

  const newState = produce(system, (draft) => {
    draft.creator = draft.creator.filter(d => d.name !== name)
  })

  setCreatorPage(newState.creator[0].name)
  systemState.set(newState)
}

export function addCreatorPageState(pageName: string, key: string, type: TypeData) {
  const system = systemState.get()

  if (!system) return

  const newState = produce(system, (draft) => {
    for (let i = 0; i < draft.creator.length; i++) {
      const page = draft.creator[i]

      if (page.name !== pageName) continue

      if (page.state.find(state => state.name === key)) return

      page.state.push({
        name: key,
        type,
        value: undefined
      })
    }
  })

  systemState.set(newState)
}

export function updateCreatorPageState(pageName: string, oldName: string, state: { name: string, type: TypeData, value: any }) {
  const system = systemState.get()

  if (!system) return

  const newState = produce(system, (draft) => {
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

  systemState.set(newState)
}

export function removeCreatorPageState(pageName: string, key: string) {
  const system = systemState.get()

  if (!system) return

  const newState = produce(system, (draft) => {
    for (let i = 0; i < draft.creator.length; i++) {
      const page = draft.creator[i]

      if (page.name !== pageName) continue

      const index = page.state.findIndex(state => state.name === key)

      if (index === -1) continue

      page.state.splice(index, 1)
    }
  })

  systemState.set(newState)
}

export function updateCharacterPageBlueprint(blueprint: BlueprintData) {
  const system = systemState.get()
  const editor = editorState.get()

  if (!system || !blueprint) return

  const newState = produce(system, (draft) => {
    const index = draft.pages.findIndex((data => data.name === editor.characterPage))

    if (index === -1) return
    
    draft.pages[index].blueprint = blueprint
  })

  systemState.set(newState)
}

export function updateCharacterLexical(lexical: string, system: SystemData, editor: EditorState) {
  const newState = produce(system, (draft) => {
    const index = draft.pages.findIndex((data => data.name === editor.characterPage))

    if (index === -1) return
    
    draft.pages[index].lexical = lz.encodeBase64(lz.compress(lexical))
  })

  systemState.set(newState)
}

export function addCharacterPage() {
  const system = systemState.get()

  if (!system) return

  const newState = produce(system, (draft) => {
    const index = draft.pages.findIndex((data => data.name === 'New Page'))

    if (index !== -1) return

    draft.pages.push({
      name: 'New Page',
      blueprint: { nodes: getDefaultNodes(), edges: [] },
      lexical: '',
      state: []
    })
  })

  systemState.set(newState)
}

export function updateCharacterPageName(oldName: string, newName: string) {
  const system = systemState.get()

  if (!system) return

  const newState = produce(system, (draft) => {
    const index = draft.pages.findIndex((data => data.name === oldName))

    if (index === -1) return

    draft.pages[index].name = newName
  })

  systemState.set(newState)
}

export function deleteCharacterPage(name: string) {
  const system = systemState.get()

  if (!system) return

  const newState = produce(system, (draft) => {
    draft.pages = draft.pages.filter(d => d.name !== name)
  })

  setCharacterPage(newState.pages[0].name)
  systemState.set(newState)
}

export function addSystemData() {
  const system = systemState.get()

  if (!system) return

  const newState = produce(system, (draft) => {
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

  systemState.set(newState)
}

export function updateSystemData(oldName: string, newData: DataType) {
  const system = systemState.get()

  if (!system) return

  const newState = produce(system, (draft) => {
    const index = draft.data.findIndex((data => data.name === oldName))

    if (index === -1) return

    if (oldName !== newData.name) {
      draft.data.splice(index, 1)
      draft.data.push(newData)
    } else {
      draft.data[index] = newData
    }
  })

  systemState.set(newState)
}

export function deleteSystemData(name: string) {
  const system = systemState.get()

  if (!system) return

  const newState = produce(system, (draft) => {
    const index = draft.data.findIndex((data => data.name === name))

    if (index === -1) return

    draft.data.splice(index, 1)
  })

  systemState.set(newState)
}

export function addType() {
  const system = systemState.get()

  if (!system) return

  const newState = produce(system, (draft) => {
    const index = draft.types.findIndex((type => type.name === 'New Type'))

    if (index !== -1) return

    draft.types.push({
      name: 'New Type',
      properties: [
        {
          key: 'name',
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

  systemState.set(newState)
}

export function updateTypeName(oldName: string, newName: string) {
  const system = systemState.get()

  if (!system) return

  const newState = produce(system, (draft) => {
    const index = draft.types.findIndex((type => type.name === oldName))

    if (index === -1) return

    draft.types[index].name = newName
  })

  systemState.set(newState)
}

export function deleteType(name: string) {
  const system = systemState.get()

  if (!system) return

  const newState = produce(system, (draft) => {
    const index = draft.types.findIndex((type => type.name === name))

    if (index === -1) return

    draft.types.splice(index, 1)
  })

  systemState.set(newState)
}

export function addTypeProperty(typeName: string) {
  const system = systemState.get()

  if (!system) return

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

  const newState = produce(system, (draft) => {
    for (let t = 0; t < draft.types.length; t++) {
      const type = draft.types[t]

      if (type.name !== typeName) continue

      const index = type.properties.findIndex((prop => prop.key === 'newProperty'))

      if (index !== -1) return

      type.properties.push(newProperty)
    }
  })

  systemState.set(newState)

  return newProperty
}

export function updateTypeProperty(typeName: string, oldKey: string, data: { key: string; typeData: TypeData }) {
  const system = systemState.get()

  if (!system) return

  const newState = produce(system, (draft) => {
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

  systemState.set(newState)
}

// TODO: check to see if any data relies on this type? and make a modal to ask if we should delete type and all related data or not.
export function deleteTypeProperty(typeName: string, key: string) {
  const system = systemState.get()

  if (!system) return

  const newState = produce(system, (draft) => {
    for (let t = 0; t < draft.types.length; t++) {
      const type = draft.types[t]

      if (type.name !== typeName) continue

      const index = type.properties.findIndex(prop => prop.key === key)

      if (index === -1) continue

      type.properties.splice(index, 1)
    }
  })

  systemState.set(newState)
}

export function addCharacterPageState(pageName: string, key: string, type: TypeData) {
  const system = systemState.get()

  if (!system) return

  const newState = produce(system, (draft) => {
    for (let i = 0; i < draft.pages.length; i++) {
      const page = draft.pages[i]

      if (page.name !== pageName) continue

      if (page.state.find(state => state.name === key)) return

      page.state.push({
        name: key,
        type,
        value: undefined
      })
    }
  })

  systemState.set(newState)
}

export function removeCharacterPageState(pageName: string, key: string) {
  const system = systemState.get()

  if (!system) return

  const newState = produce(system, (draft) => {
    for (let i = 0; i < draft.pages.length; i++) {
      const page = draft.pages[i]

      if (page.name !== pageName) continue

      const index = page.state.findIndex(state => state.name === key)

      if (index === -1) continue

      page.state.splice(index, 1)
    }
  })

  systemState.set(newState)
}

export function updateCharacterPageState(pageName: string, oldName: string, state: { name: string, type: TypeData, value: any }) {
  const system = systemState.get()

  if (!system) return

  const newState = produce(system, (draft) => {
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

  systemState.set(newState)
}