import { IonInput, IonItem, IonList, IonSearchbar, IonText } from '@ionic/react'

import { useNode } from '@craftjs/core'
import { BlueprintData } from '../state/systems';
import { openModal } from '../state/modals';
import Divider from '../components/Divider';

type SearchbarProps = {
  placeholder: string;
  blueprint: BlueprintData;
}

function Searchbar({ placeholder }: SearchbarProps) {
  const { connectors: { connect, drag } } = useNode()

  return (
    <IonSearchbar ref={ref => connect(drag(ref!))} animated={true} placeholder={placeholder} onIonInput={(ev) => (ev.target as unknown as HTMLInputElement).value} />
  )
}

function SearchbarSettings() {
  const { actions: { setProp }, placeholder, blueprint } = useNode(node => ({
    placeholder: node.data.props.placeholder,
    blueprint: node.data.props.blueprint
  }))

  return (
    <>
      <IonText>
        <h4>Props</h4>
      </IonText>
      <Divider />

      <IonList>
        <IonItem>
          <IonInput label='Placeholder' labelPlacement='floating' placeholder='Enter text' value={placeholder} onIonChange={(ev: Event) => {
            const val = (ev.target as HTMLIonInputElement).value as string

            setProp((props: any) => props.placeholder = val)
          }} />
        </IonItem>

        <IonItem button={true} onClick={() => openModal({
          type: 'blueprint',
          title: '',
          data: blueprint,
          onSave: (blueprint) => setProp((props: any) => props.blueprint = blueprint)
        })}>
          On Search Action
        </IonItem>
      </IonList>
    </>
  )
}

Searchbar.craft = {
  rules: {},
  related: {
    settings: SearchbarSettings
  }
}

export default Searchbar