
import { NodeTypes } from '@xyflow/react'
import CreateDataFromType from './nodes/object/CreateDataFromType'
import EntryNode from './nodes/EntryNode'

import GetCharacterData from './nodes/character/GetCharacterData'
import GetPageData from './nodes/GetPageData'
import GetSystemData from './nodes/GetSystemData'
import OpenModal from './nodes/OpenModal'
import OutputNode from './nodes/OutputNode'
import SetCharacterData from './nodes/character/SetCharacterData'
import SetPageData from './nodes/SetPageData'
import SetSystemData from './nodes/SetSystemData'
import SpreadObject from './nodes/object/SpreadObject'
import StringIncludes from './nodes/strings/Include'
import StringCompare from './nodes/strings/Compare'
import StringConcat from './nodes/strings/Concat'

/* Array Imports */
import RemoveFromArray from './nodes/array/Remove'
import AddItemToArray from './nodes/array/Add'
import Filter from './nodes/array/Filter'
import Map from './nodes/array/Map'
import UpdateArray from './nodes/array/Update'
import GetItemFromArray from './nodes/array/Get'

import Number from './nodes/numbers/Number'
import Subtract from './nodes/numbers/Subtract'
import Divide from './nodes/numbers/Divide'
import Floor from './nodes/numbers/Floor'
import Add from './nodes/numbers/Add'
import Multiply from './nodes/numbers/Multiply'
import NumberToString from './nodes/numbers/ToString'

import EnumCompare from './nodes/enums/Compare'
import Enum from './nodes/enums/Enum'

import Branch from './nodes/booleans/Branch'
import Inverse from './nodes/booleans/Inverse'
import String from './nodes/strings/String'
import Boolean from './nodes/booleans/Boolean'

const nodeTypes: NodeTypes = {
  /* entry and exit nodes */
  entry: EntryNode,
  output: OutputNode,

  /* Character Nodes */
  get_character_data: GetCharacterData,
  set_character_data: SetCharacterData,

  /* Page Nodes */
  get_page_data: GetPageData,
  set_page_data: SetPageData,

  /* System Nodes */
  get_system_data: GetSystemData,
  set_system_data: SetSystemData,

  /* Array Nodes */
  add_to_array: AddItemToArray,
  array_remove: RemoveFromArray,
  array_update: UpdateArray,
  array_get: GetItemFromArray,
  filter: Filter,
  map: Map,

  /* Object Nodes */
  spread_object: SpreadObject,
  create_data_from_type: CreateDataFromType,

  /* String Nodes */
  string_new: String,
  string_includes: StringIncludes,
  string_compare: StringCompare,
  string_concat: StringConcat,

  /* Number Nodes */
  new_number: Number,
  number_to_string: NumberToString,
  divide: Divide,
  add: Add,
  subtract: Subtract,
  multiply: Multiply,
  floor: Floor,

  /* Enum Nodes */
  new_enum: Enum,
  enum_compare: EnumCompare,

  /* Boolean Nodes */
  boolean_new: Boolean,
  boolean_branch: Branch,
  boolean_inverse: Inverse,

  /* No Categories */
  open_modal: OpenModal,
}

export default nodeTypes