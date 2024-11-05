import { useNode } from '@craftjs/core';
import { IonButton, IonInput, IonItem, IonList } from '@ionic/react'
import { PropsWithChildren } from 'react'
import { openModal } from '../state/modals';

function Button({ text, size, color }: PropsWithChildren<{ text: string; size: 'default' | 'small' | 'large'; color: string; }>) {
  const { connectors: { connect, drag } } = useNode()

  return (
    <IonButton ref={ref => connect(drag(ref!))} size={size} color={color}>
      {text}
    </IonButton>
  )
}

function ButtonSettings() {
  const { actions: { setProp }, text, color, size } = useNode(node => ({
    text: node.data.props.text,
    color: node.data.props.color,
    size: node.data.props.size
  }))

  return (
    <IonList>
      <IonItem>
        <IonInput label='Text' placeholder='Enter text' value={text} onIonChange={(ev: Event) => {
          const val = (ev.target as HTMLIonInputElement).value as string

          setProp((props: any) => props.text = val)
        }} />
      </IonItem>

      <IonItem>
        <IonInput label='Color' placeholder='primary' value={color} onIonChange={(ev: Event) => {
          const val = (ev.target as HTMLIonInputElement).value as string

          setProp((props: any) => props.color = val)
        }} />
      </IonItem>

      <IonItem>
        <IonInput label='Size' placeholder='default' value={size} onIonChange={(ev: Event) => {
          const val = (ev.target as HTMLIonInputElement).value as string

          setProp((props: any) => props.size = val)
        }} />
      </IonItem>

      <IonItem button={true} onClick={() => openModal({
        type: 'blueprint',
        title: '',
        data: {},
        onSave: () => {}
      })}>
        On Click Action
      </IonItem>
    </IonList>
  )
}

Button.craft = {
  rules: {},
  related: {
    settings: ButtonSettings
  }
}

export default Button