import { memo, useEffect } from 'react';
import {
  Position,
  Handle,
  useReactFlow,
  useHandleConnections,
  useNodesData,
  type NodeProps,
} from '@xyflow/react';
 
import { isTextNode, type MyNode } from './utils';
import { IonCard, IonItem, IonLabel } from '@ionic/react';
 
function UppercaseNode({ id }: NodeProps) {
  const { updateNodeData } = useReactFlow();
  const connections = useHandleConnections({
    type: 'target',
  });
  const nodesData = useNodesData<MyNode>(connections[0]?.source);
  const textNode = isTextNode(nodesData) ? nodesData : null;
 
  useEffect(() => {
    updateNodeData(id, { text: textNode?.data.text.toUpperCase() });
  }, [textNode])

  return (
    <IonCard style={{ padding: 15 }}>
      <Handle
        type='target'
        position={Position.Left}
        isConnectable={connections.length === 0}
      />
      <IonLabel>Uppercase Transform</IonLabel>
      <Handle type='source' position={Position.Right} />
    </IonCard>
  )
}
 
export default memo(UppercaseNode);