import { memo } from 'react';
import {
  Position,
  Handle,
  useReactFlow,
  type NodeProps,
  type Node,
} from '@xyflow/react';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonHeader, IonInput } from '@ionic/react';
 
function TextNode({ id, data }: NodeProps<Node<{ text: string }>>) {
  const { updateNodeData } = useReactFlow()

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>node {id}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonInput label='text' labelPlacement='floating' fill='outline' value={data.text} onIonChange={(ev: Event) => {
          const val = (ev.target as HTMLIonInputElement).value as string

          updateNodeData(id, { text: val })
        }} />
      </IonCardContent>

      <Handle type='source' position={Position.Right} />
    </IonCard>
  )
 
  return (
    <div
      style={{
        background: '#eee',
        color: '#222',
        padding: 10,
        fontSize: 12,
        borderRadius: 10,
      }}
    >
      <div>node {id}</div>
      <div style={{ marginTop: 5 }}>
        <input
          onChange={(evt) => updateNodeData(id, { text: evt.target.value })}
          value={data.text}
          style={{ display: 'block' }}
        />
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
 
export default memo(TextNode);