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
      className='bg-fantasy-glass backdrop-blur-lg border-l border-fantasy-border shadow-2xl fixed top-0 right-0 z-40 w-64 h-screen transition-transform translate-x-full lg:-translate-x-0'
      aria-label='Character Sidebar'
    >
      <div className='h-full flex flex-col px-3 py-4 overflow-y-auto'>
        <div className='py-4 mb-4 border-b border-neutral-200 dark:border-neutral-700'>
          <span className='self-center text-xl font-semibold whitespace-nowrap dark:text-white'>
            Quick Actions
          </span>
        </div>

        <div className='flex flex-col gap-2'>
          {actions?.map(a => (
            <div key={a.name} className='fantasy-card-gradient border border-fantasy-border rounded px-4 py-2 cursor-pointer transition-all duration-500 backdrop-blur-lg shadow-2xl hover:shadow-fantasy-accent/20 hover:shadow-xl hover:border-fantasy-accent/40 relative' onClick={() => {
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
