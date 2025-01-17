import { memo } from 'react'

import {
  Handle,
  type NodeProps,
  type Node,
  Position,
  useReactFlow,
  useUpdateNodeInternals,
  useHandleConnections
} from '@xyflow/react'

import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonInput, IonSelect, IonSelectOption } from '@ionic/react'
 
function OpenModal({ id, data: { type, title, inputType } }: NodeProps<Node<{ type: string, title: string, inputType: string }>>) {
  const { updateNodeData } = useReactFlow()
  const updateNodeInternals = useUpdateNodeInternals()

  useHandleConnections({
      type: 'target',
      id: 'data-object',
      onConnect: (conns) => {
        const conn = conns[0]
  
        if (!conn) return
  
        if (!conn.sourceHandle) return
  
        const sourceType = conn.sourceHandle.split('-')[1]
      
        if (!sourceType) return
  
        updateNodeData(id, { inputType: sourceType })
        updateNodeInternals(id)
      },
      onDisconnect: () => {
        updateNodeData(id, { inputType: 'unknown' })
        updateNodeInternals(id)
      }
    })

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Open Modal</IonCardTitle>
      </IonCardHeader>

      <Handle type='target' id='from-node' position={Position.Left}
        style={{ top: 30, bottom: 'auto' }}
      />

      <IonCardContent>
        <IonSelect labelPlacement='floating' color='light'
          value={type}
          onIonChange={(e) => updateNodeData(id, { type: e.detail.value })}
        >
          <IonSelectOption value='edit_object'>Edit Object</IonSelectOption>
        </IonSelect>
        <IonInput label='title' labelPlacement='stacked' fill='outline' value={title} onIonInput={(ev) => updateNodeData(id, { title: (ev.target as unknown as HTMLInputElement).value }) } />

        <p style={{ marginTop: 10 }}>input data ({inputType})</p>
        <Handle type='target' id='data-object' position={Position.Left}
          style={{ top: 145, bottom: 'auto' }}
        />

        <p style={{ textAlign: 'right' }}>on save</p>
        <Handle type='source' id='save-node' position={Position.Right}
          style={{ top: 168, bottom: 'auto' }}
        />

        <p style={{ textAlign: 'right' }}>data ({inputType})</p>
        <Handle type='source' id={`newdata-${inputType}`} position={Position.Right}
          style={{ top: 192, bottom: 'auto' }}
        />

        <p style={{ marginTop: 10, textAlign: 'right' }}>on delete</p>
        <Handle type='source' id='delete-node' position={Position.Right}
          style={{ top: 222, bottom: 'auto' }}
        />
      </IonCardContent>
    </IonCard>
  )
}
 
export default memo(OpenModal);