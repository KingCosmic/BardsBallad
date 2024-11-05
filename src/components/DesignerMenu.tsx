import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonNote, IonList, IonItem, IonLabel, IonSegment, IonSegmentButton, IonButton } from "@ionic/react"
import useBreakpoint from "../utils/useBreakpoint"
import { systemState } from "../state/system"
import { useEditor } from "@craftjs/core"

import Text from "../designer/Text"
import Button from "../designer/Button"
import { useState } from "react"
import React from "react"

function DesignerMenu() {
  const system = systemState.useValue()

  const [tab, setTab] = useState('components')

  const isLargeScreen = useBreakpoint('md', 'more')

  const { connectors } = useEditor()

  const { selected, actions } = useEditor((state, query) => {
    const [currentNodeId] = state.events.selected
    let selected;

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        settings: state.nodes[currentNodeId].related && state.nodes[currentNodeId].related.settings,
        isDeletable: query.node(currentNodeId).isDeletable()
      }
    }

    return { selected }
  })

  if (!system) return <></>

  return (
    <IonMenu menuId='info-menu' side='end' contentId='main' type='overlay' style={{ maxWidth: isLargeScreen ? '10%' : '' }}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>

        <IonSegment value={tab} onIonChange={(e) => setTab(e.target.value?.toString() || '???')}>
          <IonSegmentButton value='components'>
            <IonLabel>Components</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value='details'>
            <IonLabel>Details</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        <IonNote>
          These things will move to a better area to accomodate them, but for the time being they're going here.
        </IonNote>

        {
          (tab === 'components') ? (
            <IonList>
              <IonItem button={true} ref={ref => connectors.create(ref!, <Text text='Hi World' fontSize={24} />)}>
                <IonLabel>Text</IonLabel>
              </IonItem>
              <IonItem button={true} ref={ref => connectors.create(ref!, <Button text='Button!' size='small' color='primary' />)}>
                <IonLabel>Button</IonLabel>
              </IonItem>
            </IonList>
          ) : (tab === 'details' && selected) ? (
            <>
              {
                selected.settings && React.createElement(selected.settings)
              }
              {
                selected.isDeletable ? (
                <IonButton color='danger' onClick={() => {
                  actions.delete(selected.id)
                }}>
                  Delete
                </IonButton>
                ) : null
              }
            </>
          ) : null
        }

      </IonContent>
    </IonMenu>
  )
}

export default DesignerMenu