import { memo, useState } from 'react'

import {
  Handle,
  type NodeProps,
  type Node,
  Position,
  useReactFlow
} from '@xyflow/react'

import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonSelect, IonSelectOption, IonText } from '@ionic/react'
import { systemState } from '../../../state/system'
import { SystemType } from '../../../state/systems'
 
function CreateDataFromType({ id, data: { spreadType } }: NodeProps<Node<{ spreadType: SystemType }>>) {
  const { updateNodeData } = useReactFlow()

  const system = systemState.useValue()

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Create Object From Type</IonCardTitle>
      </IonCardHeader>

      <Handle type='target' id='from-node' position={Position.Left}
        style={{ top: 30, bottom: 'auto' }}
      />
      <Handle type='source' id='next-node' position={Position.Right}
        style={{ top: 30, bottom: 'auto' }}
      />

      <IonCardContent>
        <IonSelect aria-label='Type' interface='popover' placeholder='Select Type'
          value={spreadType}
          onIonChange={(e) => updateNodeData(id, { spreadType: e.detail.value })}
        >
          {
            system?.types.map(type => (
              <IonSelectOption value={type}>{type.name}</IonSelectOption>
            ))
          }
        </IonSelect>

        {
          spreadType.properties.map(prop => (
            <p key={prop.key} style={{ marginTop: 5 }}>
              ({prop.typeData.type}{prop.typeData.isArray ? '[]' : ''}) {prop.key}
            </p>
          ))
        }

        <p style={{ textAlign: 'right' }}>({spreadType.name}) output</p>
      </IonCardContent>

      {
        spreadType.properties.map((prop, i) => (
          <Handle key={prop.key} type='target' id={`${prop.key}-${prop.typeData.type}${prop.typeData.isArray ? '(Array)' : ''}`} position={Position.Left}
            style={{ top: 129 + (26 * i), bottom: 'auto' }}
          />
        ))
      }

      <Handle type='source' id={`output-${spreadType.name}`} position={Position.Right}
        style={{ top: 129 + (24 *  spreadType.properties.length), bottom: 'auto' }}
      />
    </IonCard>
  )
}
 
export default memo(CreateDataFromType)