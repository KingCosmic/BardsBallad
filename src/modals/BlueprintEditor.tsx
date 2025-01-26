import { useCallback, useEffect, useRef, useState } from 'react'

import { Background, Connection, Controls, Edge, MiniMap, OnBeforeDelete, Panel, ReactFlow } from '@xyflow/react'
 
import '@xyflow/react/dist/style.css'

import NodeContextMenu from '../blueprints/NodeContextMenu'
import { BlueprintData } from '../state/systems'
import ContextMenu from '../blueprints/ContextMenu'

import { blueprintState, onConnect, onEdgesChange, onNodesChange, setEdges, setNodes } from '../state/blueprint'

import nodeTypes from '../blueprints/nodeTypes'
import Modal from '../components/Modal'
import ModalHeader from '../components/Modal/Header'
import ModalBody from '../components/Modal/Body'
import ModalFooter from '../components/Modal/Footer'
import Button from '../components/inputs/Button'

type ModalProps = {
  title: string;
  onDelete?(): void;
  onSave(newData: BlueprintData): void;
  
  isVisible: boolean;
  requestClose(): void;
  data: BlueprintData;
}

const isValidConnection = (conn: Connection | Edge) => {
  if (!conn.sourceHandle || !conn.targetHandle) return false

  const sourceType = conn.sourceHandle.split('-')[1]
  const targetType = conn.targetHandle.split('-')[1]

  if (!sourceType || !targetType) return false

  if ((targetType === 'object') && !['string', 'number', 'boolean', 'enum', 'blueprint'].includes(sourceType)) return true
  if ((targetType === 'array') && sourceType.endsWith('(Array)')) return true

  return (sourceType === targetType)
}

const BlueprintEditor: React.FC<ModalProps> = ({ title, isVisible, requestClose, data, onSave }) => {
  const [nodeMenu, setNodeMenu] = useState<any | null>(null)
  const [contextMenu, setContextMenu] = useState<any | null>(null)
  const ref = useRef<any>(null)

  const { nodes, edges } = blueprintState.useValue()

  useEffect(() => {
    setNodes(data.nodes)
    setEdges(data.edges)
  }, [data])

  const onNodeContextMenu = useCallback(
    (event: any, node: any) => {
      // Prevent native context menu from showing
      event.preventDefault()

      if (!ref || !ref.current) return
 
      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      const pane = ref.current.getBoundingClientRect()
      setNodeMenu({
        id: node.id,
        top: event.clientY < pane.height - 200 && event.clientY,
        left: event.clientX < pane.width - 200 && event.clientX,
        right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
        bottom: event.clientY >= pane.height - 200 && pane.height - event.clientY,
      })
      setContextMenu(null)
    },
    [setNodeMenu]
  )

  const onBeforeDelete: OnBeforeDelete = useCallback(async ({ nodes, edges }) => {
    if (nodes.find(n => ['entry', 'output'].includes(n.type!))) return false

    return true
  }, [])

  const onContextMenu = useCallback(
    (event: any) => {
      // Prevent native context menu from showing
      event.preventDefault()

      if (!ref || !ref.current) return
 
      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      const pane = ref.current.getBoundingClientRect()
      setContextMenu({
        top: event.clientY < pane.height - 200 && event.clientY,
        left: event.clientX < pane.width - 200 && event.clientX,
        right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
        bottom: event.clientY >= pane.height - 200 && pane.height - event.clientY,
        // for spawning nodes off context menu.
        rawX: event.clientX,
        rawY: event.clientY
      })
      setNodeMenu(null)
    },
    [setContextMenu]
  )

  // Close the context menu if it's open whenever the window is clicked.
  const onPaneClick = useCallback(() => {
    setNodeMenu(null)
    setContextMenu(null)
  }, [setNodeMenu, setContextMenu])

  return (
    <div className={`${isVisible ? 'flex' : 'hidden'} z-50 absolute top-0 left-0 w-screen h-screen`}>
      <ReactFlow
        ref={ref}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onBeforeDelete={onBeforeDelete}
        isValidConnection={isValidConnection}
        onPaneClick={onPaneClick}
        onNodeContextMenu={onNodeContextMenu}
        onPaneContextMenu={onContextMenu}
        nodeTypes={nodeTypes}
        colorMode='system'
      >
        <MiniMap />
        <Background />
        <Controls />
        {nodeMenu && <NodeContextMenu onClick={onPaneClick} {...nodeMenu} />}
        {contextMenu && <ContextMenu onClick={onPaneClick} {...contextMenu} />}

        <Panel position='top-right'>
          <Button color='danger' onClick={requestClose}>
            Close
          </Button>

          <Button color='primary' onClick={() => {
            onSave({ nodes, edges })
            console.log({ nodes, edges })
            requestClose()
          }}>
            Confirm
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  )
}

export default BlueprintEditor