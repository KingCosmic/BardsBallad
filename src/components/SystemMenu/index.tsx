import { IonContent, IonHeader, IonMenu, IonNote, IonTitle, IonToolbar } from "@ionic/react"
import { editorState } from "../../state/editor"
import { systemState } from "../../state/system"
import useBreakpoint from "../../utils/useBreakpoint"
import DesignerMenu from "./DesignerSubMenu"
import { useLocation } from "react-router"

function SystemMenu() {
  const system = systemState.useValue()
  const editor = editorState.useValue()

  let location = useLocation()

  const isLargeScreen = useBreakpoint('md', 'more')

  if (!system) return <></>
  if (!location.pathname.startsWith('/systems/')) return <></>

  return (
    <IonMenu menuId='info-menu' side='end' contentId='main' type='overlay' style={{ maxWidth: isLargeScreen ? '10%' : '' }}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>

        {
          (editor.tab === 'character') ? (
            <IonNote>
              Default Character data, used for types in GetCharacterData blueprints and such.
            </IonNote>
          ) : (editor.tab === 'data') ? (
            <IonNote>
              Custom data for the system (Items, classes, etc.)
            </IonNote>
          ) : (editor.tab === 'types') ? (
            <IonNote>
              The data types for everything in this system.
            </IonNote>
          ) : (editor.tab === 'editor') && (
            <DesignerMenu />
          )
        }

      </IonContent>
    </IonMenu>
  )
}

export default SystemMenu