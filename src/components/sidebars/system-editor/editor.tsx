import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import EditString from '@/modals/editors/edit-string'
import { editorState, setCharacterPage } from '@/state/editor'
import { openModal } from '@/state/modals'
import { Plus } from 'lucide-react'
import React, { useMemo } from 'react'
import { useVersionEdits } from '@/db/version/hooks/useVersionEdits'
import { addPage, deletePage, renamePage, addPageState } from '@/db/system/methods'
import { SystemData } from '@/db/system/schema'
import storeMutation from '@/db/version/methods/storeMutation'
import { useAutomergeDoc } from '@/lib/automerge/useAutomergeDoc'
import { refrainSelectionState, updateRefrainSelectedProps } from '@/refrain/state/selectionStore'
import { systemEditorBlockDefinitions } from '@/refrain/system-blocks'
import updateAutomergeDoc from '@/lib/automerge/updateAutomergeDoc'

function EditorMenu() {
  const editor = editorState.useValue()
  const edits = useVersionEdits(editor.versionId)
  const { doc } = useAutomergeDoc<SystemData>(edits?.doc)

  const page = useMemo(
    () => doc?.pages.find((p) => p.name === editor.characterPage),
    [edits, editor.characterPage]
  )

  if (!edits || !doc) return <></>

  return (
    <>
      <SidebarHeader>
        <p className="text-xs text-muted-foreground mb-4 text-center">
          Custom WYSIWYG editor is active. Use the canvas to add and reorder blocks.
        </p>

        <div className="flex items-center gap-2">
          <Select value={editor.characterPage} onValueChange={setCharacterPage}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {doc.pages.map((p) => (
                <SelectItem key={p.name} value={p.name}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => updateAutomergeDoc(editor.versionId, addPage(doc, 'character'))}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add Page</span>
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="space-y-2">
            <div className="flex gap-2">
              <Button
                variant="destructive"
                className="flex-1"
                disabled={doc.pages.length <= 1}
                onClick={() => {
                  updateAutomergeDoc(
                    edits.local_id,
                    deletePage(doc, 'character', editor.characterPage)
                  )
                }}
              >
                Delete
              </Button>

              <Button
                variant="default"
                className="flex-1"
                onClick={() =>
                  openModal('rename-modal', ({ id }) => (
                    <EditString
                      id={id}
                      title="Rename Page"
                      data={editor.characterPage}
                      onSave={async (newName) => {
                        await updateAutomergeDoc(
                          editor.versionId,
                          renamePage(doc, 'character', editor.characterPage, newName)
                        )
                        setCharacterPage(newName)
                      }}
                    />
                  ))
                }
              >
                Rename
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator />

        <SidebarGroup>
          <div className="flex items-center justify-between">
            <SidebarGroupLabel>Page State</SidebarGroupLabel>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() =>
                storeMutation(
                  edits.local_id,
                  addPageState(doc, 'character', editor.characterPage, 'newState', {
                    type: 'string',
                    isArray: false,
                    useTextArea: false,
                    options: [],
                    outputType: 'string',
                    isOutputAnArray: false,
                    inputs: [],
                  })
                )
              }
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add Page State</span>
            </Button>
          </div>

          <SidebarGroupContent>
            {page?.state.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No page state defined</p>
            ) : (
              <SidebarMenu>
                {page?.state.map((state) => (
                  <SidebarMenuItem key={state.name}>
                    <SidebarMenuButton onClick={() => {}}>
                      <span className="truncate">{state.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {state.type.type}
                        {state.type.isArray ? '[]' : ''}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator />

        <BlockSettingsPanel />
      </SidebarContent>
    </>
  )
}

function BlockSettingsPanel() {
  const { selectedType, selectedProps } = refrainSelectionState.useValue()

  const def = useMemo(
    () => systemEditorBlockDefinitions.find((d) => d.type === selectedType),
    [selectedType]
  )

  if (!def) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Block Settings</SidebarGroupLabel>
        <SidebarGroupContent>
          <p className='text-xs text-muted-foreground text-center py-4'>
            Select a block to edit its settings
          </p>
        </SidebarGroupContent>
      </SidebarGroup>
    )
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{def.label} Settings</SidebarGroupLabel>
      <SidebarGroupContent className='space-y-3 px-2'>
        {def.Settings ? (
          <def.Settings props={selectedProps} onChange={updateRefrainSelectedProps} />
        ) : (
          <p className='text-xs text-muted-foreground text-center py-4'>
            No settings for this block type
          </p>
        )}
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default EditorMenu
