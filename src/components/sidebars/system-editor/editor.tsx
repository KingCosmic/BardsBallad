import Layers from '@/components/designer/Layers/Layers'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar'
import addPage from '@/db/system/methods/addPage'
import addPageState from '@/db/system/methods/addPageState'
import deletePage from '@/db/system/methods/deletePage'
import renamePage from '@/db/system/methods/renamePage'
import { SystemData } from '@/db/system/schema'
import storeMutation from '@/db/version/methods/storeMutation'
import { useVersionEdits } from '@/hooks/versions/useVersionEdits'
import EditString from '@/modals/editors/edit-string'
import { editorState, setCharacterPage } from '@/state/editor'
import { openModal } from '@/state/modals'
import { useEditor, Element } from '@craftjs/core'
import { Plus } from 'lucide-react'

import React, { useMemo } from 'react'

// Import designer components
import Container from '@/components/designer/components/Container/Editor'
import Text from '@/components/designer/components/Text/Editor'
import DesignerDivider from '@/components/designer/components/Divider'
import FAB from '@/components/designer/FloatingActionButton'


function EditorMenu() {
  const editor = editorState.useValue()
  const versionEdits = useVersionEdits<SystemData>(editor.versionId)

  const page = useMemo(() => versionEdits?.data.pages.find(p => p.name === editor.characterPage), [versionEdits, editor.characterPage])

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

  if (!versionEdits) return <></>

  return (
    <>
      <SidebarHeader>
        <p className="text-xs text-muted-foreground mb-4 text-center">
          This Tooling is still under heavy development. Please post any bugs on GitHub or Discord.
        </p>

        <div className="flex items-center gap-2">
          <Select value={editor.characterPage} onValueChange={setCharacterPage}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {versionEdits.data.pages.map(p => (
                <SelectItem key={p.name} value={p.name}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            size="icon"
            onClick={() => storeMutation(editor.versionId, addPage(versionEdits.data, 'character'))}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add Page</span>
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <Tabs defaultValue="components" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="components" className="flex-1">Components</TabsTrigger>
            <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
            <TabsTrigger value="state" className="flex-1">Page Info</TabsTrigger>
          </TabsList>

          <TabsContent value="components" className="space-y-2">
            <SidebarGroup>
              <SidebarGroupLabel>Components</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <div ref={ref => { if (ref) connectors.create(ref, <Element is={Container} canvas />) }}>
                      <SidebarMenuButton className="h-auto py-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 512 512">
                          <path d="M448 341.37V170.61A32 32 0 00432.11 143l-152-88.46a47.94 47.94 0 00-48.24 0L79.89 143A32 32 0 0064 170.61v170.76A32 32 0 0079.89 369l152 88.46a48 48 0 0048.24 0l152-88.46A32 32 0 00448 341.37z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"/>
                          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M69 153.99l187 110 187-110M256 463.99v-200"/>
                        </svg>
                        <span>Container</span>
                      </SidebarMenuButton>
                    </div>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <div ref={ref => { if (ref) connectors.create(ref, <Text text='Hi World' />) }}>
                      <SidebarMenuButton className="h-auto py-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 512 512">
                          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M32 415.5l120-320 120 320M230 303.5H74M326 239.5c12.19-28.69 41-48 74-48h0c46 0 80 32 80 80v144"/>
                          <path d="M320 358.5c0 36 26.86 58 60 58 54 0 100-27 100-106v-15c-20 0-58 1-92 5-32.77 3.86-68 19-68 58z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"/>
                        </svg>
                        <span>Text</span>
                      </SidebarMenuButton>
                    </div>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <div ref={ref => { if (ref) connectors.create(ref, <DesignerDivider />) }}>
                      <SidebarMenuButton className="h-auto py-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 512 512">
                          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M400 256H112"/>
                        </svg>
                        <span>Divider</span>
                      </SidebarMenuButton>
                    </div>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <div ref={ref => { if (ref) connectors.create(ref, <FAB isList={false} buttons={[]} />) }}>
                      <SidebarMenuButton className="h-auto py-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 512 512">
                          <path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="32"/>
                          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M256 176v160M336 256H176"/>
                        </svg>
                        <span>FAB</span>
                      </SidebarMenuButton>
                    </div>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <Layers />
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            {selected ? (
              <>
                {selected.settings && React.createElement(selected.settings)}

                {selected.isDeletable && (
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={() => actions.delete(selected.id)}
                  >
                    Delete
                  </Button>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Select a component to view details
              </p>
            )}
          </TabsContent>

          <TabsContent value="state" className="space-y-4">
            <SidebarGroup>
              <SidebarGroupContent className="space-y-2">
                <div className="flex gap-2">
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    disabled={versionEdits.data.pages.length <= 1}
                    onClick={() => {
                      storeMutation(versionEdits.local_id, deletePage(versionEdits.data, 'character', editor.characterPage))
                    }}
                  >
                    Delete
                  </Button>

                  <Button 
                    variant="default"
                    className="flex-1"
                    onClick={() => openModal('rename-modal', ({ id }) => (
                      <EditString 
                        id={id} 
                        title='Rename Page' 
                        data={editor.characterPage} 
                        onSave={async newName => {
                          await storeMutation(editor.versionId, renamePage(versionEdits.data, 'character', editor.characterPage, newName))
                          setCharacterPage(newName)
                        }} 
                      />
                    ))}
                  >
                    Rename
                  </Button>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {}}
                >
                  Edit Page Script
                </Button>
              </SidebarGroupContent>
            </SidebarGroup>

            <Separator />

            <SidebarGroup>
              <div className="flex items-center justify-between">
                <SidebarGroupLabel>Page State</SidebarGroupLabel>
                <Button 
                  variant="outline" 
                  size="icon-sm"
                  onClick={() => storeMutation(versionEdits.local_id, addPageState(versionEdits.data, 'character', editor.characterPage, 'newState', { type: 'string', isArray: false, useTextArea: false, options: [], outputType: 'string', isOutputAnArray: false, inputs: [] }))}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Add Page State</span>
                </Button>
              </div>

              <SidebarGroupContent>
                {page?.state.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No page state defined
                  </p>
                ) : (
                  <SidebarMenu>
                    {page?.state.map((state) => (
                      <SidebarMenuItem key={state.name}>
                        <SidebarMenuButton onClick={() => {}}>
                          <span className="truncate">{state.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {state.type.type}{state.type.isArray ? '[]' : ''}
                          </span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
          </TabsContent>
        </Tabs>
      </SidebarContent>
    </>
  )
}

export default EditorMenu