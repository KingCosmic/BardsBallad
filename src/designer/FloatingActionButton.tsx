import { IonButton, IonButtons, IonCheckbox, IonFab, IonFabButton, IonFabList, IonIcon, IonInput, IonItem, IonLabel, IonList, IonNote, IonSelect, IonSelectOption, IonText } from '@ionic/react'

import { Node, NodeHelpersType, useNode, UserComponentConfig } from '@craftjs/core'
import { add, addOutline, chevronDownOutline, chevronUp } from 'ionicons/icons'
import { BlueprintData } from '../state/systems'
import { openModal } from '../state/modals'
import Divider from '../components/Divider'
import { getDefaultNodes } from '../blueprints/utils'
import EditButtonModal from '../modals/EditButton'
import { useCallback, useState } from 'react'
import BlueprintProcessor from '../utils/Blueprints/processBlueprint'
import { LocalData, useLocalData } from './renderer/Context'

type Button = {
  name: string;
  icon: string;
  blueprint: BlueprintData;
}

type FABProps = {
  isList?: boolean;
  buttons?: Button[];
  blueprint?: BlueprintData;
}

function FAB({ isList, buttons }: FABProps) {
  const { connectors: { connect, drag } } = useNode()

  return (
    <IonFab ref={ref => connect(drag(ref!))} vertical='bottom' horizontal='end'>
      <IonFabButton>
        <IonIcon icon={isList ? chevronUp : add} />
      </IonFabButton>
      {
        isList && (
          <IonFabList side='top'>
            {
              buttons!.map((button) => (
                <IonButton key={button.name}
                  style={{ alignSelf: 'right', marginRight: '100%' }}
                >
                  <IonText>{button.name}</IonText>
                </IonButton>
              ))
            }
          </IonFabList>
        )
      }
    </IonFab>
  )
}

export function FABPreview({ blueprint, isList, buttons }: FABProps) {
  const localData = useLocalData()

  const onClick = useCallback(() => {
    const processor = new BlueprintProcessor(blueprint!)

    processor.processBlueprint(localData)
  }, [blueprint, localData])

  return (
    <IonFab slot='fixed' vertical='bottom' horizontal='end'>
      <IonFabButton onClick={isList ? undefined : onClick}>
        <IonIcon icon={isList ? chevronUp : add} />
      </IonFabButton>
      {
        isList && (
          <IonFabList side='top'>
            {
              buttons!.map((button) => <FABButtonPreview key={button.name} button={button} localData={localData} />)
            }
          </IonFabList>
        )
      }
    </IonFab>
  )
}

function FABButtonPreview({ button, localData }: { button: Button, localData: LocalData }) {
  const onClick = useCallback(() => {
    const processor = new BlueprintProcessor(button.blueprint!)

    processor.processBlueprint(localData)
  }, [button.blueprint, localData])

  return (
    <IonButton onClick={onClick}
      style={{ alignSelf: 'right', marginRight: '100%' }}
    >
      <IonText>{button.name}</IonText>
    </IonButton>
  )
}

function FABSettings() {
  const { actions: { setProp }, isList, buttons, blueprint } = useNode(node => ({
    isList: node.data.props.isList,
    buttons: node.data.props.buttons,
    blueprint: node.data.props.blueprint
  }))

  const [editData, setEditData] = useState<any | null>(null)

  return (
    <IonList>
      <IonItem>
        <IonCheckbox value={isList} onIonChange={() => setProp((props: any) => props.isList = !isList)}>is List?</IonCheckbox>
      </IonItem>

      {
        isList ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h5 style={{ marginLeft: 10 }}>Buttons</h5>

              <div>
                <IonButtons>
                  <IonButton onClick={() => setProp((props: any) => {
                    if (!props.buttons.find((b: Button) => b.name === 'new button'))

                    props.buttons.push({ name: 'new button', icon: '', blueprint: { nodes: getDefaultNodes(), edges: [] } })

                    return props
                  })} >
                    <IonIcon slot='icon-only' icon={addOutline} />
                  </IonButton>
                </IonButtons>
              </div>
            </div>

            <Divider />

            {
              buttons.map((button: Button) => (
                <IonItem key={button.name} button={true} onClick={() => setEditData(button)}>
                  {button.name}
                </IonItem>
              ))
            }

            <EditButtonModal data={editData} isOpen={editData !== null} requestClose={() => setEditData(null)} onSave={(newButton) => setProp((props: any) => {
              for (let i = 0; i < props.buttons.length; i++) {
                if (props.buttons[i].name !== editData!.name) continue

                props.buttons[i] = newButton
              }

              return props
            })} onDelete={() => setProp((props: any) => props.buttons = props.buttons.filter((b: any) => b.name !== editData!.name))} />
          </>
        ) : (
          <IonItem button={true} onClick={() => openModal({
            type: 'blueprint',
            title: '',
            data: blueprint,
            onSave: (blueprint) => setProp((props: any) => props.blueprint = blueprint)
          })}>
            On Click
          </IonItem>
        )
      }
    </IonList>
  )
}

const CraftSettings: Partial<UserComponentConfig<FABProps>> = {
  defaultProps: {
    isList: false,
    buttons: [],
    blueprint: {
      nodes: getDefaultNodes(),
      edges: []
    },
  },
  related: {
    settings: FABSettings
  }
}

FAB.craft = CraftSettings

export default FAB