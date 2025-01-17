import { useEditor, Element } from "@craftjs/core"
import { IonSelect, IonSelectOption, IonButtons, IonButton, IonIcon, IonSegment, IonSegmentButton, IonNote, IonText, IonList, IonItem, IonLabel, IonAccordionGroup, IonAccordion } from "@ionic/react"
import { addOutline, cubeOutline, hammerOutline, codeSlashOutline, chevronDownOutline } from "ionicons/icons"
import React, { useState } from "react"
import { getDefaultNodes } from "../../blueprints/utils"
import FAB from "../../designer/FloatingActionButton"
import Text from '../../designer/components/Text'
import Searchbar from "../../designer/Searchbar"
import EditPageStateModal from "../../modals/EditPageState"
import { editorState, setPage } from "../../state/editor"
import { systemState, addPageState, addPage, updatePageName, deletePage } from "../../state/system"
import { TypeData } from "../../state/systems"
import Divider from "../Divider"
import DesignerDivider from "../../designer/components/Divider"
import EditStringModal from "../../modals/EditString"
import Container from "../../designer/components/Container"
import Layers from "../../designer/Layers/Layers"


function DesignerMenu() {
  const system = systemState.useValue()
  const editor = editorState.useValue()

  const [tab, setTab] = useState('components')

  const [editingState, setEditingState] = useState<{ name: string, type: TypeData } | null>(null)

  const [editName, setEditName] = useState<any>(null)

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
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <IonSelect label='Page' labelPlacement='floating' fill='outline' value={editor.page} onIonChange={(e) => setPage(e.detail.value)} aria-label='page' interface='popover' placeholder='Select Page'>
          {
            system.pages.map((page) => (
              <IonSelectOption key={page.name} value={page.name}>{page.name}</IonSelectOption>
            ))
          }
        </IonSelect>

        <div>
          <IonButtons>
            <IonButton onClick={() => addPage()}>
              <IonIcon slot='icon-only' icon={addOutline} />
            </IonButton>
          </IonButtons>
        </div>
      </div>

      <IonSegment value={tab} onIonChange={(e) => setTab(e.target.value?.toString() || '???')}>
        <IonSegmentButton value='components'>
          <IonIcon icon={cubeOutline} />
        </IonSegmentButton>
        <IonSegmentButton value='details'>
          <IonIcon icon={hammerOutline} />
        </IonSegmentButton>
        <IonSegmentButton value='state'>
          <IonIcon icon={codeSlashOutline} />
        </IonSegmentButton>
      </IonSegment>

      <IonNote style={{ marginTop: 20, marginBottom: 10 }}>
        This Tooling is still under heavy development. Please post any bugs found on github issues.
      </IonNote>

      {
        (tab === 'components') ? (
          <>
            <IonText>
              <h4>Components</h4>
            </IonText>
            <Divider />
            <ul className='space-y-1'>
              <li>
                <a
                  href=''
                  className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  ref={ref => connectors.create(ref!, <Element is={Container} canvas />)}
                >
                  Container
                </a>
              </li>

              <li>
                <a
                  href=''
                  className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  ref={ref => connectors.create(ref!, <Text text='Hi World' fontSize={24} blueprint={{ nodes: getDefaultNodes([], {
                    name: 'text',
                    type: 'string',
                    isArray: false
                  }), edges: [] }} />)}
                >
                  Text
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  ref={ref => connectors.create(ref!, <Searchbar placeholder='Search...' blueprint={{ nodes: getDefaultNodes([
                    {
                      name: 'searchText',
                      type: 'string',
                      isArray: false
                    }
                  ]), edges: [] }} />)}
                >
                  Searchbar
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  ref={ref => connectors.create(ref!, <DesignerDivider />)}
                >
                  Divider
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  ref={ref => connectors.create(ref!, <FAB isList={false} buttons={[]} blueprint={{ nodes: getDefaultNodes(), edges: [] }} />)}
                >
                  Floating Action Button
                </a>
              </li>
            </ul>
          </>
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
        ) : (tab === 'state') ? (
          <>
            <EditStringModal data={editName} isOpen={editName !== null}
              requestClose={() => setEditName(null)}
              onSave={(newName) => {
                updatePageName(editName, newName)
                setPage(newName)
              }}
            />

            <IonButtons>
              <IonButton fill='solid' color='primary' onClick={() => setEditName(editor.page)}>Rename Page</IonButton>
              <IonButton fill='solid' color='danger' disabled={system.pages.length <= 1} onClick={() => {
                deletePage(editor.page)
              }}>Delete Page</IonButton>
            </IonButtons>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <h5 style={{ marginRight: 5 }}>Page State</h5>

                <IonIcon slot='icon-only' color='' icon={chevronDownOutline} />
              </div>

              <div>
                <IonButtons>
                  <IonButton id='add-page-state' onClick={() => addPageState(editor.page, 'newState', { type: 'string', isArray: false, useTextArea: false, options: [] })}>
                    <IonIcon slot='icon-only' icon={addOutline} />
                  </IonButton>
                </IonButtons>
              </div>
            </div>

            <Divider />

            <IonList>
              {
                system.pages.find(p => p.name === editor.page)?.state.map((state) => (
                  <IonItem key={state.name} button={true} onClick={() => setEditingState(state)}>
                    <IonLabel>{state.name} | {state.type.type}{state.type.isArray ? '[]': ''}</IonLabel>
                  </IonItem>
                ))
              }
            </IonList>

            <EditPageStateModal isOpen={editingState !== null} requestClose={() => setEditingState(null)} data={editingState} />
          </>
        ) : null
      }

      {
        (tab !== 'state') ? (
          <>
            <Layers />
          </>
        ) : null
      }
    </>
  )
}

export default DesignerMenu