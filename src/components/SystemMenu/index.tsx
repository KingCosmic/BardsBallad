
import DesignerMenu from './EditorMenu'

import { editorState } from '@state/editor'
import CreatorMenu from './CreatorMenu'
import { useVersionResource } from '@hooks/useVersionResource'

function SystemMenu() {
  const editor = editorState.useValue()
  const versionedResource = useVersionResource(editor.versionId)

  if (!versionedResource) return <></>

  return (
    <aside
      className='border-l border-neutral-500 dark:border-neutral-700 fixed top-0 right-0 z-40 w-64 h-screen transition-transform translate-x-full sm:-translate-x-0'
      aria-label='Editor Sidebar'
    >
      <div className='h-full flex flex-col px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-neutral-950'>
        <div className='py-4 mb-4 border-b border-neutral-200 dark:border-neutral-700'>
          <span className='self-center text-xl font-semibold whitespace-nowrap dark:text-white'>
            Details
          </span>
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
          ) : (editor.tab === 'creator') && (
            <CreatorMenu />
          )
        }
      </div>
    </aside>
  )
}

export default SystemMenu
