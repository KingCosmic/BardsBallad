
import DesignerMenu from './DesignerSubMenu'

import { editorState } from '../../state/editor'
import { systemState } from '../../state/system'

function SystemMenu() {
  const system = systemState.useValue()
  const editor = editorState.useValue()

  if (!system) return <></>

  return (
    <aside
      className='fixed top-0 right-0 z-40 w-64 h-screen transition-transform translate-x-full sm:-translate-x-0'
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
          ) : (editor.tab === 'editor') && (
            <DesignerMenu />
          )
        }
      </div>
    </aside>
  )
}

export default SystemMenu