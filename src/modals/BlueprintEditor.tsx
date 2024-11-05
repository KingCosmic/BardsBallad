import React, { useCallback, useRef, useState } from 'react'

import {
  IonButtons,
  IonButton,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonInput,
  IonItem,
  IonSelect,
  IonSelectOption,
} from '@ionic/react'

import { addEdge, Background, Controls, Edge, OnConnect, ReactFlow, useEdgesState, useNodesState } from '@xyflow/react'
 
import '@xyflow/react/dist/style.css'
import './BlueprintEditor.css'

import ResultNode from '../blueprints/ResultNode'
import TextNode from '../blueprints/TextNode'
import UppercaseNode from '../blueprints/UppercaseNode'
import { MyNode } from '../blueprints/utils'

const nodeTypes = {
  text: TextNode,
  result: ResultNode,
  uppercase: UppercaseNode,
}

const initialNodes: MyNode[] = [
  {
    id: '1',
    type: 'text',
    data: {
      text: 'hello',
    },
    position: { x: -100, y: -50 },
  },
  {
    id: '2',
    type: 'text',
    data: {
      text: 'world',
    },
    position: { x: 0, y: 100 },
  },
  {
    id: '3',
    type: 'uppercase',
    data: { text: '' },
    position: { x: 100, y: -100 },
  },
  {
    id: '4',
    type: 'result',
    data: {},
    position: { x: 300, y: -75 },
  },
];
 
const initialEdges: Edge[] = [
  {
    id: 'e1-3',
    source: '1',
    target: '3',
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
  },
  {
    id: 'e2-4',
    source: '2',
    target: '4',
  },
];

type ModalProps = {
  title: string;
  onDelete?(): void;
  onSave(newData: { [key:string]: any }): void;
  
  isVisible: boolean;
  requestClose(): void;
  data: { [key:string]: any };
}

function BlueprintEditor({ isVisible, requestClose }: ModalProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  )

  return (
    <IonModal isOpen={isVisible}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonButton onClick={requestClose}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>Action Flow</IonTitle>
          <IonButtons slot='end'>
            <IonButton color='primary' strong={true} onClick={requestClose}>
              Confirm
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          colorMode='system'
          fitView
        >
          <Controls />
          <Background />
        </ReactFlow>
      </IonContent>
    </IonModal>
  )
}

export default BlueprintEditor