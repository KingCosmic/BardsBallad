import { addEdge, applyEdgeChanges, applyNodeChanges, Connection, Edge, EdgeChange, Node, NodeChange } from '@xyflow/react'
import { newRidgeState } from 'react-ridge-state'

export type BlueprintState = {
  nodes: Node[];
  edges: Edge[];
}

export const blueprintState = newRidgeState<BlueprintState>({
  nodes: [],
  edges: []
})

export function onNodesChange(changes: NodeChange<Node>[]) {
  blueprintState.set((prevState) => (
    {
      ...prevState,
      nodes: applyNodeChanges(changes, prevState.nodes)
    }
  ))
}

export function onEdgesChange(changes: EdgeChange<Edge>[]) {
  blueprintState.set((prevState) => (
    {
      ...prevState,
      edges: applyEdgeChanges(changes, prevState.edges)
    }
  ))
}

export function onConnect(connection: Connection) {
  blueprintState.set((prevState) => (
    {
      ...prevState,
      edges: addEdge(connection, prevState.edges)
    }
  ))
}

export function setNodes(nodes: Node[]) {
  blueprintState.set((prevState) => (
    {
      ...prevState,
      nodes
    }
  ))
}

export function setEdges(edges: Edge[]) {
  blueprintState.set((prevState) => (
    {
      ...prevState,
      edges
    }
  ))
}