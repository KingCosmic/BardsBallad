import React, { useCallback, useMemo } from 'react'
import type { BlockDefinition } from '../context/BlockRegistryContext'
import { useLocalData } from '../context/LocalDataContext'
import { useScriptRunner } from '@/components/providers/script-runner'
import FloatingActionButton from '@/components/ui/fab'
import { DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ScriptField } from '../components/ScriptField'
import type { Script } from '@/types/script'

const emptyScript: Script = { source: '', compiled: '', isCorrect: false }

type FABButton = {
  name: string
  icon: string
  script: Script
}

// ── Editor ────────────────────────────────────────────────────────────────────

const FABRender: BlockDefinition['Render'] = ({ props }) => {
  const buttons: FABButton[] = props.buttons ?? []
  return (
    <FloatingActionButton>
      <DropdownMenuContent side='top' className='w-56' align='start'>
        {buttons.map((btn) => (
          <DropdownMenuItem key={btn.name} disabled>
            <span>{btn.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </FloatingActionButton>
  )
}

// ── Preview ───────────────────────────────────────────────────────────────────

const FABPreview: NonNullable<BlockDefinition['Preview']> = ({ props, state, updateState }) => {
  const localData = useLocalData()
  const { isReady, runScript } = useScriptRunner()

  const buttons: FABButton[] = props.buttons ?? []
  const mainScript: Script = props.script ?? emptyScript
  const isList = Boolean(props.isList)

  const scriptState = useMemo(() => ({ ...state, ...localData }), [state, localData])

  const onClick = useCallback(() => {
    if (isList || !isReady || !mainScript.isCorrect) return
    runScript(undefined, mainScript, scriptState, updateState)
  }, [isList, mainScript, scriptState, isReady])

  return (
    <FloatingActionButton onClick={isList ? undefined : onClick}>
      <DropdownMenuContent side='top' className='w-56' align='start'>
        {buttons.map((btn) => (
          <DropdownMenuItem
            key={btn.name}
            onClick={() => {
              if (!isReady || !btn.script.isCorrect) return
              runScript(undefined, btn.script, scriptState, updateState)
            }}
          >
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

// ── Settings ─────────────────────────────────────────────────────────────────

const FABSettings: NonNullable<BlockDefinition['Settings']> = ({ props, onChange }) => {
  const set = (patch: Record<string, any>) => onChange({ ...props, ...patch })
  const buttons: FABButton[] = props.buttons ?? []

  const updateButton = (idx: number, patch: Partial<FABButton>) => {
    const next = buttons.map((b, i) => i === idx ? { ...b, ...patch } : b)
    set({ buttons: next })
  }

  return (
    <Accordion type='multiple' defaultValue={['general', 'buttons']}>
      <AccordionItem value='general'>
        <AccordionTrigger>General</AccordionTrigger>
        <AccordionContent className='flex flex-col gap-3'>
          <div className='flex items-center gap-2'>
            <Checkbox
              id='fab-islist'
              checked={Boolean(props.isList)}
              onCheckedChange={(v) => set({ isList: Boolean(v) })}
            />
            <Label htmlFor='fab-islist'>Is List</Label>
          </div>
          {!props.isList && (
            <ScriptField
              label='On Press Script'
              script={props.script ?? emptyScript}
              expectedType='null'
              onChange={(s) => set({ script: s })}
            />
          )}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='buttons'>
        <AccordionTrigger>Buttons ({buttons.length})</AccordionTrigger>
        <AccordionContent className='flex flex-col gap-4'>
          {buttons.map((btn, idx) => (
            <div key={idx} className='border rounded p-2 flex flex-col gap-2'>
              <div className='flex items-center justify-between'>
                <span className='text-xs font-medium'>Button {idx + 1}</span>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => set({ buttons: buttons.filter((_, i) => i !== idx) })}
                >
                  ✕
                </Button>
              </div>
              <div className='space-y-1'>
                <Label>Name</Label>
                <Input
                  value={btn.name}
                  onChange={(e) => updateButton(idx, { name: e.target.value })}
                />
              </div>
              <div className='space-y-1'>
                <Label>Icon</Label>
                <Input
                  value={btn.icon}
                  placeholder='icon name or emoji'
                  onChange={(e) => updateButton(idx, { icon: e.target.value })}
                />
              </div>
              <ScriptField
                label='Script'
                script={btn.script ?? emptyScript}
                expectedType='null'
                onChange={(s) => updateButton(idx, { script: s })}
              />
            </div>
          ))}
          <Button
            variant='outline'
            size='sm'
            onClick={() => set({ buttons: [...buttons, { name: 'Action', icon: '', script: emptyScript }] })}
          >
            + Add Button
          </Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

// ── Definition ────────────────────────────────────────────────────────────────

export const fabBlockDefinition: BlockDefinition = {
  type: 'fab',
  label: 'Action Button',
  defaultProps: () => ({
    isList: false,
    buttons: [],
    script: emptyScript,
  }),
  Render: FABRender,
  Preview: FABPreview,
  Settings: FABSettings,
}
