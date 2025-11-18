import { useNode, UserComponentConfig } from '@craftjs/core'
import { openModal } from '@state/modals'
import Divider from '@components/Divider'
import { getDefaultNodes } from '@blueprints/utils'
import EditButtonModal from '@modals/EditButton'

import {  useCallback, useMemo, useState } from 'react'

import { BlueprintProcessorState } from '@utils/Blueprints/processBlueprint'

import { useLocalData } from './renderer/Context'
import FloatingActionButton from '@components/FloatingActionButton'
import Checkbox from '@components/inputs/Checkbox'
import ScriptEditor from '@modals/ScriptEditor'
import { Script } from '@/types/script'
import runCode from '@utils/verse/runCode'
import { useLocalState } from './hooks/useLocalState'
import { useVersionEdits } from '@hooks/useVersionEdits'
import { editorState } from '@state/editor'
import { SystemData, SystemType } from '@storage/schemas/system'
import { useScriptRunner } from '@components/ScriptRunnerContext'

type Button = {
  name: string;
  icon: string;
  script: Script;
}

type FABProps = {
  /* props that are only used in preview when processing blueprints */
  state?: BlueprintProcessorState;
  updateState?(newState: BlueprintProcessorState): void;

  isList?: boolean;
  buttons?: Button[];
  script?: Script;

  // Local state this component will pass to its children.
  local?: any;
  // calculated local state based off the parent components.
  calculateLocalState?: any;
}

function FAB({ buttons, isList }: FABProps) {
  const { connectors: { connect, drag } } = useNode()

  const [isOpen, setIsOpen] = useState(false)

  return (
    // @ts-ignore
    <FloatingActionButton ref={ref => connect(drag(ref!))} buttons={buttons?.map(btn => ({ name: btn.name, icon: btn.icon, onClick: () => {} }))} isOpen={isOpen} onClick={() => isList ? setIsOpen(!isOpen) : false} />
  )
}

export function FABPreview({ script, isList, buttons, state, updateState }: FABProps) {
  const localData = useLocalData()
  const { isReady, runScript } = useScriptRunner()

  const [isOpen, setIsOpen] = useState(false)

  const s = useMemo(() => ({
    ...state,
    ...localData,
  }), [localData, state])

  const onClick = useCallback(() => {
    if (isList) return setIsOpen(!isOpen)

    if (!script!.isCorrect || !isReady) return

    runScript(script!.compiled, s, updateState!)
  }, [script, s, updateState, isOpen, isList, updateState])

  return (
    <FloatingActionButton
      isOpen={isOpen}
      onClick={onClick}
      buttons={buttons?.map(btn => ({
        name: btn.name, icon: btn.icon,
        onClick: () => {
          if (!btn.script.isCorrect || !isReady) return

          runScript(btn.script.compiled, s, updateState!)
        }
      }))}
    />
  )
}

function FABSettings() {
  const { id, actions: { setProp }, isList, buttons, script } = useNode(node => ({
    isList: node.data.props.isList,
    buttons: node.data.props.buttons,
    script: node.data.props.script
  }))

  const localParams = useLocalState(id)

  const editor = editorState.useValue()
  const versionEdits = useVersionEdits<SystemData>(editor.versionId)

  const types: SystemType[] = useMemo(() => [
    versionEdits?.data.defaultCharacterData._type,
    ...(versionEdits?.data.types ?? [])
  ], [versionEdits])

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

                    props.buttons.push({ name: 'new button', icon: '', script: { compiled: '', source: '', isCorrect: true, returnType: 'null', blueprint: { nodes: getDefaultNodes(), edges: [] } } })

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
                <p key={button.name} onClick={() => {
                  openModal('button', ({ id }) => (
                    <EditButtonModal id={id} data={button} isOpen={true}
                      types={types}
                      globals={localParams}
                      onSave={(newButton) => setProp((props: any) => {
                      for (let i = 0; i < props.buttons.length; i++) {
                        if (props.buttons[i].name !== button.name) continue

                        props.buttons[i] = newButton
                      }

                      return props
                    })} onDelete={() => setProp((props: any) => props.buttons = props.buttons.filter((b: any) => b.name !== button.name))} />
                  ))
                }}>
                  {button.name}
                </p>
              ))
            }
          </>
        ) : (
          <p onClick={() => {
            openModal('script', ({ id }) => (
              <ScriptEditor id={id} code={script}
                onSave={({ result }) => setProp((props: any) => props.script = result)}
                globals={localParams} expectedType='null' types={types}
              />
            ))
          }}>
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
    script: {
      source: '',
      compiled: '',
      blueprint: { nodes: [], edges: [] },
      isCorrect: false
    },
  },
  related: {
    settings: FABSettings
  }
}

FAB.craft = CraftSettings

export default FAB
