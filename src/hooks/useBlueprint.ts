import { useState } from 'react'

import { Node, Edge, NodeChange, applyNodeChanges, EdgeChange, applyEdgeChanges, Connection, addEdge } from '@xyflow/react'
import { BlueprintData } from '../types/blueprint'

export function useBlueprint(data: BlueprintData) {
  const [nodes, setNodes] = useState<Node[]>(data.nodes)
  const [edges, setEdges] = useState<Edge[]>(data.edges)

  function onNodesChange(changes: NodeChange<Node>[]) {
    setNodes(applyNodeChanges(changes, nodes))
  }
  
  function onEdgesChange(changes: EdgeChange<Edge>[]) {
    setEdges(applyEdgeChanges(changes, edges))
  }
  
  function onConnect(connection: Connection) {
    setEdges(addEdge(connection, edges))
  }

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
  }
} 