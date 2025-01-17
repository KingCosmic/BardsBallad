import { memo } from 'react'

import {
  Handle,
  type NodeProps,
  type Node,
  Position,
  useReactFlow,
  useUpdateNodeInternals
} from '@xyflow/react'

import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonInput, IonSelect, IonSelectOption, IonText } from '@ionic/react'
import { editorState } from '../../state/editor'
import { systemState } from '../../state/system'
import { TypeData } from '../../state/systems'
 
function SetPageDataNode({ id, data: { chosenState } }: NodeProps<Node<{ chosenState: { name: string, type: TypeData } | null }>>) {
  const { updateNodeData } = useReactFlow()
  const updateNodeInternals = useUpdateNodeInternals()

  const system = systemState.useValue()
  const editor = editorState.useValue()

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Set Page State</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
          <IonSelect label='State' labelPlacement='stacked'
            value={chosenState}
            onIonChange={(e) => {
              updateNodeData(id, { chosenState: e.detail.value })
              updateNodeInternals(id)
            }}
          >
          {
            system?.pages.find(p => p.name === editor.page)?.state.map((state) => (
              <IonSelectOption value={state}>
                {state.name}
              </IonSelectOption>
            ))
          }
        </IonSelect>

        <IonText>
          {
            chosenState ? (
              <p>{chosenState.type.type}{chosenState.type.isArray ? '[]': ''}</p>
            ) : (
              <p>select a page state to update.</p>
            )
          }
        </IonText>
      </IonCardContent>
      <Handle type='target' id='a-next' position={Position.Left} style={{ top: 30, bottom: 'auto' }} />
      <Handle type='source' id='b-next' position={Position.Right} style={{ top: 30, bottom: 'auto' }} />

      {
        chosenState && <Handle type='target' id={`${chosenState.name}-${chosenState.type.type}${chosenState.type.isArray ? '(Array)': ''}`} position={Position.Left} style={{ top: 122, bottom: 'auto' }} />
      }
    </IonCard>
  )
}
 
export default memo(SetPageDataNode);