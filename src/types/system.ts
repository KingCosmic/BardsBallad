import { Param } from '../blueprints/utils'

export interface SystemData {
  id: string
  name: string
  version: string
  creator: PageData[]
  modals: PageData[]
  pages: PageData[]
  data: DataType[]
  defaultCharacterData: { [key: string]: any }
  types: SystemType[]
}

export interface PageData {
  name: string
  blueprint: {
    nodes: any[]
    edges: any[]
  }
  lexical: string
  state: StateData[]
}

export interface StateData {
  name: string
  type: TypeData
  value: any
}

export interface DataType {
  name: string
  typeData: TypeData
  data: any
}

export interface SystemType {
  name: string
  properties: {
    key: string
    typeData: TypeData
  }[]
}

export interface TypeData {
    type: string;
    gen?: any;
  
    /* String Specific */
    useTextArea: boolean;
  
    /* Array Specific */
    isArray: boolean;
  
    /* Enum Specific */
    options: string[];
  
    /* Blueprint Specfic */
    outputType: string;
    isOutputAnArray: boolean;
    inputs: Param[]
  }