import { newRidgeState } from 'react-ridge-state'

import { DataType, SystemData, TypeData } from './systems'

import { produce } from 'immer'
import { getDefaultNodes } from '../blueprints/utils'
import { editorState, setPage } from './editor'

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

export function updatePageLexical(lexical: string) {
  const system = systemState.get()
  const editor = editorState.get()

  if (!system || lexical === '{}') return

  const newState = produce(system, (draft) => {
    const index = draft.pages.findIndex((data => data.name === editor.page))

    if (index === -1) return
    
    draft.pages[index].lexical = lz.encodeBase64(lz.compress(lexical))
  })

  systemState.set(newState)
}

export function addPage() {
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

export function updatePageName(oldName: string, newName: string) {
  const system = systemState.get()

  if (!system) return

  const newState = produce(system, (draft) => {
    const index = draft.pages.findIndex((data => data.name === oldName))

    if (index === -1) return

    draft.pages[index].name = newName
  })

  systemState.set(newState)
}

export function deletePage(name: string) {
  const system = systemState.get()

  if (!system) return

  const newState = produce(system, (draft) => {
    draft.pages = draft.pages.filter(d => d.name !== name)
  })

  setPage(newState.pages[0].name)
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
        useTextArea: false
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
            useTextArea: false
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
      useTextArea: false
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

export function addPageState(pageName: string, key: string, type: TypeData) {
  const system = systemState.get()

  if (!system) return

  const newState = produce(system, (draft) => {
    for (let i = 0; i < draft.pages.length; i++) {
      const page = draft.pages[i]

      if (page.name !== pageName) continue

      if (page.state.find(state => state.name === key)) return

      page.state.push({
        name: key,
        type
      })
    }
  })

  systemState.set(newState)
}

export function removePageState(pageName: string, key: string) {
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

export function updatePageState(pageName: string, oldName: string, state: { name: string, type: TypeData }) {
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



export function savePage(pageName: string, ) {
  const system = systemState.get()

  if (!system) return

  const newState = produce(system, (draft) => {
    for (let i = 0; i < draft.pages.length; i++) {
      const page = draft.pages[i]

      if (page.name !== pageName) continue

      // TODO: save page.
    }
  })

  systemState.set(newState)
}