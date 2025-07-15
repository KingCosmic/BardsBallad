import { useNode, UserComponentConfig } from '@craftjs/core'
import { BlueprintData } from '@/types/blueprint'
import { openModal } from '@state/modals'
import Divider from '@components/Divider'
import { getDefaultNodes } from '@blueprints/utils'
import EditButtonModal from '@modals/EditButton'

import {  useCallback, useState } from 'react'

import BlueprintProcessor, { BlueprintProcessorState } from '@utils/Blueprints/processBlueprint'

import { useLocalData } from './renderer/Context'
import FloatingActionButton from '@components/FloatingActionButton'
import Checkbox from '@components/inputs/Checkbox'
import BlueprintEditor from '@modals/BlueprintEditor'

type Button = {
  name: string;
  icon: string;
  blueprint: BlueprintData;
}

type FABProps = {
  /* props that are only used in preview when processing blueprints */
  state?: BlueprintProcessorState;
  updateState?(newState: BlueprintProcessorState): void;

  isList?: boolean;
  buttons?: Button[];
  blueprint?: BlueprintData;

  // Local state this component will pass to its children.
  local?: any;
  // calculated local state based off the parent components.
  calculateLocalState?: any;
}

function FAB({ buttons }: FABProps) {
  const { connectors: { connect, drag } } = useNode()

  return (
    // @ts-ignore
    <FloatingActionButton ref={ref => connect(drag(ref!))} buttons={buttons?.map(btn => ({ name: btn.name, icon: btn.icon, onClick: () => {} }))} isOpen={true} />
  )
}

export function FABPreview({ blueprint, isList, buttons, state, updateState }: FABProps) {
  const localData = useLocalData()

  const [isOpen, setIsOpen] = useState(false)

  const onClick = useCallback(() => {
    if (isList) return setIsOpen(!isOpen)

    const processor = new BlueprintProcessor(blueprint!)

    processor.processBlueprint(localData, state!, updateState!)
  }, [blueprint, localData, state, updateState, isOpen, isList])

  return (
    <FloatingActionButton
      isOpen={isOpen}
      onClick={onClick}
      buttons={buttons?.map(btn => ({ name: btn.name, icon: btn.icon, onClick: () => new BlueprintProcessor(btn.blueprint!).processBlueprint(localData, state!, updateState!) }))}
    />
  )
}

function FABSettings() {
  const { actions: { setProp }, isList, buttons, blueprint } = useNode(node => ({
    isList: node.data.props.isList,
    buttons: node.data.props.buttons,
    blueprint: node.data.props.blueprint
  }))

  const [editData, setEditData] = useState<any | null>(null)

  return (
    <div>
      <Checkbox id='isList' label='is List?' checked={isList} onChange={(value) => setProp((props: any) => props.isList = value)} />

      {
        isList ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h5 style={{ marginLeft: 10 }}>Buttons</h5>

              <div>
                <button type='button'
                  className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                  onClick={() => setProp((props: any) => {
                    if (!props.buttons.find((b: Button) => b.name === 'new button'))

                    props.buttons.push({ name: 'new button', icon: '', blueprint: { nodes: getDefaultNodes(), edges: [] } })

                    return props
                  })}
                >
                  <svg
                    className='group-hover:rotate-45 transition-transform w-5 h-5'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 18 18'
                  >
                    <path
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M9 1v16M1 9h16'
                    />
                  </svg>
                  <span className='sr-only'>Icon description</span>
                </button>
              </div>
            </div>

            <Divider />

            {
              buttons.map((button: Button) => (
                <p key={button.name} onClick={() => setEditData(button)}>
                  {button.name}
                </p>
              ))
            }

            <EditButtonModal data={editData} isOpen={editData !== null} requestClose={() => setEditData(null)} onSave={(newButton) => setProp((props: any) => {
              for (let i = 0; i < props.buttons.length; i++) {
                if (props.buttons[i].name !== editData!.name) continue

                props.buttons[i] = newButton
              }

              return props
            })} onDelete={() => setProp((props: any) => props.buttons = props.buttons.filter((b: any) => b.name !== editData!.name))} />
          </>
        ) : (
          <p onClick={() => 
            openModal('blueprint', ({ id }) => (
              <BlueprintEditor id={id} data={blueprint} onSave={(bp) => setProp((props: any) => props.blueprint = bp)} />
            ))}>
            On Click
          </p>
        )
      }
    </div>
  )
}

const CraftSettings: Partial<UserComponentConfig<FABProps>> = {
  defaultProps: {
    isList: false,
    buttons: [],
    blueprint: {
      nodes: getDefaultNodes(),
      edges: []
    },
  },
  related: {
    settings: FABSettings
  }
}

FAB.craft = CraftSettings

export default FAB
