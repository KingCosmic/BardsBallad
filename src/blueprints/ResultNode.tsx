import { memo } from 'react';
import {
  Handle,
  Position,
  useHandleConnections,
  useNodesData,
} from '@xyflow/react';
import { isTextNode, type MyNode } from './utils';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';
 
function ResultNode() {
  const connections = useHandleConnections({
    type: 'target',
  });
  const nodesData = useNodesData<MyNode>(
    connections.map((connection) => connection.source),
  );
  const textNodes = nodesData.filter(isTextNode)

  return (
    <IonCard>
      <Handle type='target' position={Position.Left} />
      <IonCardHeader>
        <IonCardTitle>Return</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <p>incoming texts</p>

        {textNodes.map(({ data }, i) => <div key={i}>{data.text}</div>) ||
          'none'}
      </IonCardContent>
    </IonCard>
  )
}
 
export default memo(ResultNode);