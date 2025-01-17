import { type Node } from '@xyflow/react';

export type EntryNode = Node<{ params: Param[] }, 'entry'>;
export type OutputNode = Node<{ param: Param }, 'output'>;

export type GetSystemData = Node<{ path: string }, 'get_system_data'>
export type SetSystemData = Node<{ path: string, data: any }, 'set_system_data'>
export type GetPageData = Node<{ path: string }, 'get_page_data'>
export type SetPageData = Node<{ path: string, data: any }, 'set_page_data'>
export type GetCharacterData = Node<{ path: string }, 'get_character_data'>
export type SetCharacterData = Node<{ path: string, data: any }, 'set_character_data'>
export type Filter = Node<{  }, 'filter'>
export type Map = Node<{  }, 'map'>
export type CreateDataFromType = Node<{  }, 'create_data_from_type'>
export type OpenModal = Node<{  }, 'open_modal'>

export type TextNode = Node<{ text: string }, 'text'>
export type UppercaseNode = Node<{ text: string }, 'uppercase'>

export type MyNodes = EntryNode | OutputNode | GetSystemData | TextNode | UppercaseNode
 
export function isTextNode(
  node: any,
): node is TextNode | UppercaseNode {
  return !node ? false : node.type === 'text' || node.type === 'uppercase'
}

export function isEntryNode(
  node: any,
): node is EntryNode {
  return !node ? false : node.type === 'entry'
}

export type Param = {
  name: string;
  type: string;
  isArray: boolean;
}

export function getDefaultNodes(params: Param[] = [], outputParam?: Param): MyNodes[] {
  const nodes: MyNodes[] = []

  nodes.push({
    id: '1',
    type: 'entry',
    data: {
      params
    },
    position: { x: 100, y: 100 }
  })

  if (outputParam) {
    nodes.push({
      id: '2',
      type: 'output',
      data: {
        param: outputParam
      },
      position: { x: 250, y: 100 }
    })
  }

  return nodes
}

export function updateParams(nodes: MyNodes[] = [], params: Param[] = []): MyNodes[] {
  const index = nodes.findIndex(n => n.type === 'entry')

  if (index === -1) {
    return nodes
  }

  (nodes[index] as EntryNode).data.params = params

  return nodes
}

export function getDefaultDataForType(type: string) {
  switch (type) {
    case 'get_system_data':
      return { path: '', type: 'unknown' }
    case 'get_page_data':
      return { path: '', type: 'unknown' }
    case 'get_character_data':
      return { path: '', type: 'unknown' }
    case 'set_system_data':
      return { path: '', type: 'unknown' }
    case 'set_page_data':
      return { path: '', type: 'unknown' }
    case 'set_character_data':
      return { path: '', type: 'unknown' }
    case 'open_modal':
      return { type: 'edit_object', title: 'edit object', inputType: '' }
    case 'create_data_from_type':
      return { spreadType: { name: '', properties: [] } }
    case 'spread_object':
      return { inputType: 'unknown' }
    case 'add_to_array':
      return { inputType: 'unknown' }
    case 'array_remove':
      return { inputType: 'unknown' }
    case 'array_update':
      return { inputType: 'unknown' }
    case 'array_get':
      return { inputType: 'unknown' }
    case 'filter':
      return { inputType: 'unknown' }
    case 'map':
      return { inputType: 'unknown' }
    case 'string_new':
      return { value: '' }
    case 'string_includes':
      return { string1: '', string2: '' }
    case 'string_compare':
      return { string1: '', string2: '' }
    case 'string_concat':
      return { string1: '', string2: '' }
    case 'number_to_string':
      return { number: 0 }
    case 'new_number':
      return { value: 0 }
    case 'add':
      return { number1: 0, number2: 0 }
    case 'subtract':
      return { number1: 0, number2: 0 }
    case 'divide':
      return { number1: 0, number2: 0 }
    case 'multiply':
        return { number1: 0, number2: 0 }
    case 'floor':
      return { number: 0 }
    case 'new_enum':
      return { value: '' }
    case 'enum_compare':
      return { input: '' }
    case 'boolean_new':
      return { value: false }
    case 'boolean_branch':
      return { boolean: false }
    case 'boolean_inverse':
      return {}
    default:
      return null
  }
}