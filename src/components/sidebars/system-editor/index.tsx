import { SystemData } from "@/db/system/schema"
import { useVersionEdits } from "@/hooks/versions/useVersionEdits"
import { editorState } from "@/state/editor"
import { Sidebar, SidebarContent } from "@/components/ui/sidebar"
import EditorMenu from "./editor"


function SystemMenu() {
  const editor = editorState.useValue()
  const versionedResource = useVersionEdits<SystemData>(editor.versionId)

  if (!versionedResource) return <></>

  return (
    <Sidebar side='right' collapsible="offcanvas">
      <SidebarContent className='py-4'>
        {
          (editor.tab === 'editor') ? (
            <EditorMenu />
          ) : (
            <>
              {/* TODO: Implement other tabs with shadcn components */}
              {(editor.tab === 'character') && (
                <p className="p-4">
                  Default Character data, used for types in GetCharacterData nodes and such.
                </p>
              )}
              {(editor.tab === 'data') && (
                <p className="p-4">
                  Custom data for the system (Items, classes, etc.)
                </p>
              )}
              {(editor.tab === 'types') && (
                <p className="p-4">
                  The data types for everything in this system.
                </p>
              )}
              {(editor.tab === 'actions') && (
                <p className="p-4">
                  Quick actions such as long rest, reset spell slots, etc.
                </p>
              )}
            </>
          )
        }
      </SidebarContent>
    </Sidebar>
  )
}

export default SystemMenu