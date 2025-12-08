import { useNode, UserComponentConfig } from '@craftjs/core'

import {  useCallback, useMemo, useState } from 'react'

import { useLocalData } from './renderer/Context'
import { Script } from '@/types/script'
import { useLocalState } from './hooks/useLocalState'
import { useScriptRunner } from '../providers/script-runner'
import { editorState } from '@/state/editor'
import { useVersionEdits } from '@/hooks/versions/useVersionEdits'
import { SystemData, SystemType } from '@/db/system/schema'
import { Separator } from '../ui/separator'
import { Checkbox } from '../ui/checkbox'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { openModal } from '@/state/modals'
import ScriptEditor from '@/modals/editors/script-editor'
import FloatingActionButton from '../ui/fab'
import { DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu'

type Button = {
  name: string;
  icon: string;
  script: Script;
}

type FABProps = {
  /* props that are only used in preview when processing blueprints */
  state?: any;
  updateState?(newState: any): void;

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

  const s = useMemo(() => ({
    ...state,
    ...localData,
  }), [localData, state])

  const onClick = useCallback(() => {
    if (!script!.isCorrect || !isReady) return

    runScript(undefined, script!, s, updateState!)
  }, [script, s, updateState, isList, updateState])

  return (
    <FloatingActionButton onClick={isList ? undefined : onClick}>
      <DropdownMenuContent side='top' className='w-56' align='start'>
        {buttons?.map(btn => (
          <DropdownMenuItem key={btn.name} onClick={() => {
          if (!btn.script.isCorrect || !isReady) return

          runScript(undefined, btn.script, s, updateState!)
        }}>
            {/* TODO: add icon support */}
            <svg
              className='w-5 h-5 mx-auto'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 18 18'
            >
              <path d='M14.419 10.581a3.564 3.564 0 0 0-2.574 1.1l-4.756-2.49a3.54 3.54 0 0 0 .072-.71 3.55 3.55 0 0 0-.043-.428L11.67 6.1a3.56 3.56 0 1 0-.831-2.265c.006.143.02.286.043.428L6.33 6.218a3.573 3.573 0 1 0-.175 4.743l4.756 2.491a3.58 3.58 0 1 0 3.508-2.871Z' />
            </svg>
            <span className='absolute block mb-px text-sm font-medium -translate-x-full -translate-y-1/2 -start-3 top-1/2 shadow-black'>
              {btn.name}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </FloatingActionButton>
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
      <div>
        <Checkbox checked={isList} onCheckedChange={val => setProp((props: any) => props.isList = val.valueOf())} />
        <Label>is List?</Label>
      </div>

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

                    props.buttons.push({ name: 'new button', icon: '', script: { compiled: '', source: '', isCorrect: true, returnType: 'null' } })

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

            <Separator />

            {/* {
              buttons.map((button: Button) => (
                <Button key={button.name} variant='outline' onClick={() => {
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
                </Button>
              ))
            } */}
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
      isCorrect: false
    },
  },
  related: {
    settings: FABSettings
  }
}

FAB.craft = CraftSettings

export default FAB
