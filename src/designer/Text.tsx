import { IonInput, IonItem, IonList, IonText } from '@ionic/react'

import { useNode } from '@craftjs/core'

function Text({ text, fontSize }: { text: string; fontSize: number }) {
  const { connectors: { connect, drag } } = useNode()

  return (
    <IonText ref={ref => connect(drag(ref!))}>
      <p style={{ fontSize: `${fontSize}px` }}>{text}</p>
    </IonText>
  )
}

function TextSettings() {
  const { actions: { setProp }, text, fontSize } = useNode(node => ({
    text: node.data.props.text,
    fontSize: node.data.props.fontSize
  }))

  return (
    <IonList>
      <IonItem>
        <IonInput label='text' placeholder='lorem ipsum' value={text} onIonChange={(ev: Event) => {
          const val = (ev.target as HTMLIonInputElement).value as string

          setProp((props: any) => props.text = val)
        }} />
      </IonItem>

      <IonItem>
        <IonInput label='Font Size' type='number' placeholder='22' value={fontSize} onIonChange={(ev: Event) => {
          const val = (ev.target as HTMLIonInputElement).value as string

          setProp((props: any) => props.fontSize = +val)
        }} />
      </IonItem>
      {/* <IonItem> TODO: make a enum selector for fontSizeType (em, px, etc?)
        <IonInput label='Font Size' type='number' placeholder='22' />
      </IonItem> */}
    </IonList>
  )
}

Text.craft = {
  rules: {
    canDrag: (node: any) => node.data.props.text !== 'Drag'
  },
  related: {
    settings: TextSettings
  }
}

export default Text