import { BlueprintData } from '../../state/systems'
import { findEntryNode } from './findEntryNode'

import { Node } from '@xyflow/react'
import { getNode } from './getNode'
import { getNodeScript } from './getNodeScript'

class BlueprintProcessor {
  blueprint: BlueprintData

  input: { [key: string]: any } = {}
  nodeState: Map<string, Map<string, any>> = new Map()
  params: Map<string, any> = new Map()
  output: any = null

  constructor(bp: BlueprintData) {
    this.blueprint = bp
  }

  processBlueprint(input: { [key: string]: any }) {
    const entryNode = findEntryNode(this.blueprint)

    this.input = input

    return this.processNodes(entryNode)
  }

  processNodes(node: Node | undefined): any {
    const nextNode = this.processNode(node)

    if (!nextNode) return this.getOutput()
  
    return this.processNodes(nextNode)
  }

  processNode(node: Node | undefined) {
    if (!node) return

    const script = getNodeScript(node.type || '')

    if (!this.nodeState.get(node.id) && script.init) {
      this.nodeState.set(node.id, new Map())
      script.init(this, node)
    }

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

  setOutput(value: any) {
    this.output = value
  }

  getOutput() {
    return this.output
  }
}

export default BlueprintProcessor