import { IonText } from '@ionic/react'

import { useNode } from '@craftjs/core'
import { PropsWithChildren } from 'react';

function Container({ background, padding = '0px', children }: PropsWithChildren<{ background: string; padding: string; }>) {
  const { connectors: { connect, drag } } = useNode()

  return (
    <div ref={ref => connect(drag(ref!))} style={{ margin: '5px 0', background, padding }}>
      {children}
    </div>
  )
}

export default Container