import { findEntryNode } from './findEntryNode'

import { Node } from '@xyflow/react'
import { getNode } from './getNode'
import { getNodeScript } from './getNodeScript'
import { BlueprintData } from '@/types/blueprint'

import { type PageData, SystemData } from '@storage/schemas/system'
import { type Character } from '@storage/schemas/character'

export type BlueprintProcessorState = {
  system: SystemData;
  character: Character;
  page: PageData;
}

class BlueprintProcessor {
  blueprint: BlueprintData;

  state!: BlueprintProcessorState

  input: { [key: string]: any } = {}
  nodeState: Map<string, Map<string, any>> = new Map()
  params: Map<string, any> = new Map()
  output: any = null

  callback: (updatedState: BlueprintProcessorState) => void = () => {}

  constructor(bp: BlueprintData) {
    this.blueprint = bp
  }

  processBlueprint(input: { [key: string]: any }, state: BlueprintProcessorState, cb: (updatedState: BlueprintProcessorState) => void) {
    const entryNode = findEntryNode(this.blueprint)

    this.state = state
    this.input = input

    this.callback = cb

    const val = this.processNodes(entryNode)

    return val
  }

  processNodes(node: Node | undefined): any {
    const nextNode = this.processNode(node)

    if (!nextNode) {
      this.callback(this.state)
      return this.getOutput()
    }
  
    return this.processNodes(nextNode)
  }

  processNode(node: Node | undefined) {
    if (!node) return

    // console.log('node type', node.type)
    const script = getNodeScript(node.type || '')

    if (!this.nodeState.get(node.id) && script.init) {
      this.nodeState.set(node.id, new Map())
      script.init(this, node)
    }

    // console.log('processing')
    const nextNode = script.process(this, node)

    return nextNode
  }

  getConnectingNodeForHandle(node: Node, handleName: string, type: 'input' | 'output') {
    const edge = this.blueprint.edges.find(e => (type === 'input' ? (e.target === node.id) : (e.source === node.id)) && ((e.sourceHandle?.split('-')[0] === handleName && type === 'output') || (e.sourceHandle?.split('-')[0] === handleName && type === 'input')))

    if (!edge) return

    if (type === 'output') {
      return getNode(this.blueprint, edge.target)
    } else if (type === 'input') {
      return getNode(this.blueprint, edge.source)
    }

    return
  }

  getPossibleParamsForNode(nodeID: string, type: 'input' | 'output') {
    return this.blueprint.edges.filter(e => (type === 'input') ? (e.target === nodeID) : (e.source === nodeID)).map(e => (type === 'input') ? e.targetHandle?.split('-')[0] : e.sourceHandle?.split('-')[0])
  }

  getParamType(nodeID: string, paramName: string) {
    const edges = this.blueprint.edges.filter(e => (e.target === nodeID) && (e.targetHandle?.split('-')[0] === paramName))

    const edge = edges.find((edge) => (this.params.get(edge.id) !== undefined))

    return edge?.targetHandle?.split('-')[1]
  }

  getParam(nodeID: string, paramName: string) {
    const edges = this.blueprint.edges.filter(e => (e.target === nodeID) && (e.targetHandle?.split('-')[0] === paramName))

    const edge = edges.find((edge) => (this.params.get(edge.id) !== undefined))

    return this.params.get(edge?.id || '')
  }

  setParam(nodeID: string, paramName: string, value: any) {
    const edges = this.blueprint.edges.filter(e => (e.source === nodeID) && (e.sourceHandle?.split('-')[0] === paramName))

    for (let e = 0; e < edges.length; e++) {
      this.params.set(edges[e].id, value)
    }

    return this.params
  }

  getState() {
    return this.state
  }

  getCharacter() {
    return this.state.character
  }

  setCharacter(value: any) {
    this.state.character = value
  }

  getSystem() {
    return this.state.system
  }

  setSystem(value: any) {
    this.state.system = value
  }

  getPage() {
    return this.state.page
  }

  setPage(value: any) {
    this.state.page = value
  }

  getOutput() {
    return this.output
  }

  setOutput(value: any) {
    this.output = value
  }
}

export default BlueprintProcessor
