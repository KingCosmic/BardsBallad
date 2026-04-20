import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type { BlockDefinition } from '../context/BlockRegistryContext'
import { useLocalData } from '../context/LocalDataContext'
import { useScriptRunner } from '@/components/providers/script-runner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ScriptField } from '../components/ScriptField'
import type { Script } from '@/types/script'

const emptyScript: Script = { source: '', compiled: '', isCorrect: false }

type OptionItem = { name: string }

// ── Editor ────────────────────────────────────────────────────────────────────

const SelectRender: BlockDefinition['Render'] = ({ props }) => {
  return (
    <div className='space-y-1'>
      <Label>{props.label || 'Select'}</Label>
      <Select disabled>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='(bound via script in Preview)' />
        </SelectTrigger>
        <SelectContent />
      </Select>
    </div>
  )
}

// ── Preview ───────────────────────────────────────────────────────────────────

const SelectPreview: NonNullable<BlockDefinition['Preview']> = ({ props, state, updateState }) => {
  const localData = useLocalData()
  const { isReady, runScript } = useScriptRunner()
  const [value, setValue] = useState('default')
  const [options, setOptions] = useState<OptionItem[]>([])

  const scriptState = useMemo(() => ({ ...state, ...localData }), [state, localData])

  const optionsScript: Script = props.optionsScript ?? emptyScript
  const onChangeScript: Script = props.onChange ?? emptyScript

  useEffect(() => {
    async function run() {
      if (!props.dynamicOptions || !isReady) return setOptions(props.options ?? [])
      if (!optionsScript.isCorrect) return setOptions([])
      const output = await runScript<OptionItem[]>(undefined, optionsScript, scriptState, updateState)
      setOptions(output.result ?? [])
    }
    run()
  }, [props.dynamicOptions, props.optionsScript, props.options, scriptState, isReady])

  const handleChange = useCallback((selected: string) => {
    setValue(selected)
    if (!isReady || !onChangeScript.isCorrect) return
    const selectedItem = options.find((o) => o.name === selected)
    runScript(undefined, onChangeScript, { ...scriptState, selectedValue: selectedItem ?? selected }, updateState)
  }, [props.onChange, options, scriptState, isReady])

  return (
    <div className='space-y-1'>
      <Label>{props.label || 'Select'}</Label>
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Select an option...' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='default' disabled>Select an option...</SelectItem>
          {options.map((o) => (
            <SelectItem key={o.name} value={o.name}>{o.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

// ── Settings ─────────────────────────────────────────────────────────────────

const SelectSettings: NonNullable<BlockDefinition['Settings']> = ({ props, onChange }) => {
  const set = (patch: Record<string, any>) => onChange({ ...props, ...patch })
  const options: OptionItem[] = props.options ?? []

  return (
    <Accordion type='multiple' defaultValue={['general', 'options']}>
      <AccordionItem value='general'>
        <AccordionTrigger>General</AccordionTrigger>
        <AccordionContent className='flex flex-col gap-3'>
          <div className='space-y-1'>
            <Label>Label</Label>
            <Input value={props.label ?? ''} onChange={(e) => set({ label: e.target.value })} />
          </div>
          <div className='flex items-center gap-2'>
            <Checkbox
              id='select-dynamic'
              checked={Boolean(props.dynamicOptions)}
              onCheckedChange={(v) => set({ dynamicOptions: Boolean(v) })}
            />
            <Label htmlFor='select-dynamic'>Dynamic Options</Label>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='options'>
        <AccordionTrigger>Options</AccordionTrigger>
        <AccordionContent className='flex flex-col gap-3'>
          {props.dynamicOptions ? (
            <ScriptField
              label='Options Script'
              script={props.optionsScript ?? emptyScript}
              expectedType='array'
              onChange={(s) => set({ optionsScript: s })}
            />
          ) : (
            <div className='flex flex-col gap-2'>
              {options.map((opt, idx) => (
                <div key={idx} className='flex items-center gap-2'>
                  <Input
                    className='flex-1'
                    value={opt.name}
                    onChange={(e) => {
                      const next = options.map((o, i) => i === idx ? { ...o, name: e.target.value } : o)
                      set({ options: next })
                    }}
                  />
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => set({ options: options.filter((_, i) => i !== idx) })}
                  >
                    ✕
                  </Button>
                </div>
              ))}
              <Button variant='outline' size='sm' onClick={() => set({ options: [...options, { name: '' }] })}>
                + Add Option
              </Button>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='scripts'>
        <AccordionTrigger>Scripts</AccordionTrigger>
        <AccordionContent>
          <ScriptField
            label='On Change'
            script={props.onChange ?? emptyScript}
            expectedType='null'
            onChange={(s) => set({ onChange: s })}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

// ── Definition ────────────────────────────────────────────────────────────────

export const selectBlockDefinition: BlockDefinition = {
  type: 'select',
  label: 'Select',
  defaultProps: () => ({
    label: 'Select',
    dynamicOptions: false,
    optionsScript: emptyScript,
    options: [],
    onChange: emptyScript,
  }),
  Render: SelectRender,
  Preview: SelectPreview,
  Settings: SelectSettings,
}
