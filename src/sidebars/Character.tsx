import { Character } from '@storage/schemas/character'
import { ActionType, SystemData } from '@storage/schemas/system'
import BlueprintProcessor, { BlueprintProcessorState } from '@utils/Blueprints/processBlueprint'

interface Props {
  actions: ActionType[],
  system: SystemData,
  character: Character,
  updateState(state: BlueprintProcessorState): void,
}

const CharacterSidebar: React.FC<Props> = ({ actions, system, character, updateState }) => {
  return (
    <aside
      className='border-l border-neutral-500 dark:border-neutral-700 fixed top-0 right-0 z-40 w-64 h-screen transition-transform translate-x-full sm:-translate-x-0'
      aria-label='Character Sidebar'
    >
      <div className='h-full flex flex-col px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-neutral-950'>
        <div className='py-4 mb-4 border-b border-neutral-200 dark:border-neutral-700'>
          <span className='self-center text-xl font-semibold whitespace-nowrap dark:text-white'>
            Quick Actions
          </span>
        </div>

        <div className='flex flex-col gap-2'>
          {actions?.map(a => (
            <div key={a.name} className='bg-neutral-800 border border-neutral-700 p-2 rounded cursor-pointer hover:bg-neutral-700 hover:border-neutral-800' onClick={() => {
              const processor = new BlueprintProcessor(a.blueprint)

              const pageState = {
                name: 'null page',
                blueprint: { nodes: [], edges: [] },
                lexical: '',
                state: []
              }

              processor.processBlueprint({}, { system, character, page: pageState }, updateState)
            }}>
              <p className='text-neutral-100'>{a.name}</p>
              <p className='text-sm text-neutral-300'>{a.description}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default CharacterSidebar
