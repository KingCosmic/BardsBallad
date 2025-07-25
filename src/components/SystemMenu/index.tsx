
import DesignerMenu from './EditorMenu'

import { editorState } from '@state/editor'
import CreatorMenu from './CreatorMenu'
import ModalsMenu from './ModalsMenu'
import { useVersionEdits } from '@hooks/useVersionEdits'
import { SystemData } from '@storage/schemas/system'
import DropdownButton from '@components/DropdownButton'
import Button from '@components/inputs/Button'

function SystemMenu() {
  const editor = editorState.useValue()
  const versionedResource = useVersionEdits<SystemData>(editor.versionId)

  if (!versionedResource) return <></>

  return (
    <aside
      className='bg-fantasy-glass backdrop-blur-lg border-l border-fantasy-border shadow-2xl fixed top-0 right-0 z-40 w-64 h-screen transition-transform translate-x-full lg:-translate-x-0'
      aria-label='Editor Sidebar'
    >
      <div className='h-full flex flex-col px-3 py-4 overflow-y-auto'>
        <div className='py-4 mb-4 border-b border-neutral-200 dark:border-neutral-700'>
          <span className='self-center text-xl font-semibold whitespace-nowrap dark:text-white'>
            Details
          </span>

          {/* <Button color='light'>Help</Button> */}
        </div>

        {
          (editor.tab === 'character') ? (
            <p>
              Default Character data, used for types in GetCharacterData nodes and such.
            </p>
          ) : (editor.tab === 'data') ? (
            <p>
              Custom data for the system (Items, classes, etc.)
            </p>
          ) : (editor.tab === 'types') ? (
            <p>
              The data types for everything in this system.
            </p>
          ) : (editor.tab === 'editor') ? (
            <DesignerMenu />
          ) : (editor.tab === 'creator') ? (
            <CreatorMenu />
          ) : (editor.tab === 'modals') ? (
            <ModalsMenu versionEdits={versionedResource} />
          ) : (editor.tab === 'actions') && (
            <p>
              Quick actions such as long rest, reset spell slots, ect.
            </p>
          )
        }
      </div>
    </aside>
  )
}

export default SystemMenu
