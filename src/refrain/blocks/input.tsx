import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type { BlockDefinition } from '../context/BlockRegistryContext'
import { useLocalData } from '../context/LocalDataContext'
import { useScriptRunner } from '@/components/providers/script-runner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ScriptField } from '../components/ScriptField'
import type { Script } from '@/types/script'

const emptyScript: Script = { source: '', compiled: '', isCorrect: false }

const spacing: Record<string, string> = {
  '0': '0px', 'px': '1px', '0.5': '0.125rem', '1': '0.25rem', '1.5': '0.375rem',
  '2': '0.5rem', '2.5': '0.625rem', '3': '0.875rem', '4': '1rem', '5': '1.25rem',
  '6': '1.5rem', '7': '1.75rem', '8': '2rem', '9': '2.25rem', '10': '2.5rem',
}

const sizes: Record<string, string> = { 'auto': 'auto', 'full': '100%', 'half': '50%', 'third': '33%', ...spacing }

// ── Editor ────────────────────────────────────────────────────────────────────

const InputRender: BlockDefinition['Render'] = ({ props, onChange }) => {
  return (
    <div className='space-y-1'>
      <Label htmlFor={props.label ?? 'input'}>{props.label || 'Input'}</Label>
      <Input
        id={props.label ?? 'input'}
        type={props.type ?? 'text'}
        placeholder='(bound via script in Preview)'
        disabled
      />
    </div>
  )
}

// ── Preview ───────────────────────────────────────────────────────────────────

const InputPreview: NonNullable<BlockDefinition['Preview']> = ({ props, state, updateState }) => {
  const localData = useLocalData()
  const { isReady, runScript } = useScriptRunner()
  const [value, setValue] = useState('')

  const scriptState = useMemo(() => ({ ...state, ...localData }), [state, localData])

  const getValueScript: Script = props.getValue ?? emptyScript
  const onChangeScript: Script = props.onChange ?? emptyScript

  useEffect(() => {
    async function run() {
      if (!isReady || !getValueScript.isCorrect) return setValue('')
      const output = await runScript<string>(undefined, getValueScript, scriptState, updateState)
      setValue(output.result ?? '')
    }
    run()
  }, [props.getValue, scriptState, isReady])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    if (!isReady || !onChangeScript.isCorrect) return
    runScript(undefined, onChangeScript, { ...scriptState, 'field value': newValue }, updateState)
  }, [props.onChange, scriptState, isReady])

  return (
    <Input
      id={props.label ?? 'input'}
      type={props.type ?? 'text'}
      value={value}
      onChange={handleChange}
      style={{
        marginTop: spacing[props.marginTop] ?? undefined,
        marginRight: spacing[props.marginRight] ?? undefined,
        marginBottom: spacing[props.marginBottom] ?? undefined,
        marginLeft: spacing[props.marginLeft] ?? undefined,
        width: sizes[props.width] ?? undefined,
        maxWidth: sizes[props.maxWidth] ?? undefined,
        minWidth: sizes[props.minWidth] ?? undefined,
      }}
    />
  )
}

const SPACING_KEYS = Object.keys(spacing)
const SIZE_KEYS = Object.keys(sizes)

const InputSettings: NonNullable<BlockDefinition['Settings']> = ({ props, onChange }) => {
  const set = (patch: Record<string, any>) => onChange({ ...props, ...patch })

  return (
    <Accordion type='multiple' defaultValue={['general', 'scripts']}>
      <AccordionItem value='general'>
        <AccordionTrigger>General</AccordionTrigger>
        <AccordionContent className='flex flex-col gap-3'>
          <div className='space-y-1'>
            <Label>Label</Label>
            <Input value={props.label ?? ''} onChange={(e) => set({ label: e.target.value })} />
          </div>
          <div className='space-y-1'>
            <Label>Type</Label>
            <Select value={props.type ?? 'text'} onValueChange={(v) => set({ type: v })}>
              <SelectTrigger className='w-full'><SelectValue /></SelectTrigger>
              <SelectContent>
                {['text', 'number', 'email', 'password'].map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='scripts'>
        <AccordionTrigger>Scripts</AccordionTrigger>
        <AccordionContent className='flex flex-col gap-3'>
          <ScriptField
            label='Get Value'
            script={props.getValue ?? emptyScript}
            expectedType='string'
            onChange={(s) => set({ getValue: s })}
          />
          <ScriptField
            label='On Change'
            script={props.onChange ?? emptyScript}
            expectedType='null'
            onChange={(s) => set({ onChange: s })}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='sizing'>
        <AccordionTrigger>Sizing</AccordionTrigger>
        <AccordionContent className='grid grid-cols-2 gap-3'>
          {['width', 'maxWidth', 'minWidth'].map((key) => (
            <div key={key} className='space-y-1'>
              <Label className='capitalize'>{key.replace(/([A-Z])/g, ' $1')}</Label>
              <Select value={props[key] ?? 'auto'} onValueChange={(v) => set({ [key]: v })}>
                <SelectTrigger className='w-full'><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SIZE_KEYS.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='spacing'>
        <AccordionTrigger>Spacing</AccordionTrigger>
        <AccordionContent className='grid grid-cols-2 gap-3'>
          {['marginTop', 'marginRight', 'marginBottom', 'marginLeft'].map((key) => (
            <div key={key} className='space-y-1'>
              <Label className='capitalize'>{key.replace('margin', '')}</Label>
              <Select value={props[key] ?? '0'} onValueChange={(v) => set({ [key]: v })}>
                <SelectTrigger className='w-full'><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SPACING_KEYS.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

// ── Definition ────────────────────────────────────────────────────────────────

export const inputBlockDefinition: BlockDefinition = {
  type: 'input',
  label: 'Input',
  defaultProps: () => ({
    label: 'Input',
    type: 'text',
    getValue: emptyScript,
    onChange: emptyScript,
    marginTop: '0',
    marginRight: '0',
    marginBottom: '0',
    marginLeft: '0',
    width: 'full',
    maxWidth: undefined,
    minWidth: undefined,
  }),
  Render: InputRender,
  Preview: InputPreview,
  Settings: InputSettings,
}
