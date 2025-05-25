import { Node } from '@xyflow/react'

import EntryNode from './scripts/entryNode'
import OutputNode from './scripts/outputNode'

import GetCharacterData from './scripts/character/getCharacterData'
import SetCharacterData from './scripts/character/setCharacterData'

import AddItemToArray from './scripts/arrays/add'
import Remove from './scripts/arrays/remove'
import Update from './scripts/arrays/update'
import Filter from './scripts/arrays/filter'
import Map from './scripts/arrays/map'
import Get from './scripts/arrays/get'

import SpreadObject from './scripts/object/spread'

import NewString from './scripts/strings/string'
import StringIncludes from './scripts/strings/includes'
import StringCompare from './scripts/strings/compare'
import StringConcat from './scripts/strings/concat'
import numberToString from './scripts/numbers/numberToString'

import BlueprintProcessor from '@utils/Blueprints/processBlueprint'

import createDataFromType from './scripts/object/createDataFromType'

import Enum from './scripts/enums/enum'
import EnumCompare from './scripts/enums/compare'
import number from './scripts/numbers/number'
import Divide from './scripts/numbers/divide'
import Subtract from './scripts/numbers/subtract'
import floor from './scripts/numbers/floor'
import Add from './scripts/numbers/add'
import Multiply from './scripts/numbers/multiply'

import Boolean from './scripts/booleans/boolean'
import Branch from './scripts/booleans/branch'
import Inverse from './scripts/booleans/inverse'

import openModal from './scripts/openModal'
import getSystemData from './scripts/system/getSystemData'

import setPageState from './scripts/page/setPageState'
import getPageState from './scripts/page/getPageState'

export interface NodeScript {
  init?(processor: BlueprintProcessor, node: Node): void

  process(processor: BlueprintProcessor, node: Node): Node | void
}

export const nodeScripts: { [key:string]: NodeScript } = {
  entry: EntryNode,
  output: OutputNode,

  get_character_data: GetCharacterData,
  set_character_data: SetCharacterData,

  get_system_data: getSystemData,

  get_page_data: getPageState,
  set_page_data: setPageState,
  
  number_to_string: numberToString,

  /* Array Scripts */
  add_to_array: AddItemToArray,
  array_get: Get,
  array_remove: Remove,
  array_update: Update,
  filter: Filter,
  map: Map,

  /* String Scripts */
  string_new: NewString,
  string_includes: StringIncludes,
  string_compare: StringCompare,
  string_concat: StringConcat,

  /* Object Scripts */
  spread_object: SpreadObject,
  create_data_from_type: createDataFromType,

  /* Number Scripts */
  new_number: number,
  divide: Divide,
  add: Add,
  subtract: Subtract,
  floor: floor,
  multiply: Multiply,

  /* Enum Scripts */
  new_enum: Enum,
  enum_compare: EnumCompare,

  /* Boolean Scripts */
  boolean_new: Boolean,
  boolean_branch: Branch,
  boolean_inverse: Inverse,

  /* No Categories */
  open_modal: openModal
}
