import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type { BlockDefinition } from '../context/BlockRegistryContext'
import { useLocalData } from '../context/LocalDataContext'
import { useViewerState } from '../context/ViewerContext'
import { useScriptRunner } from '@/components/providers/script-runner'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ScriptField } from '../components/ScriptField'
import type { Script } from '@/types/script'

const emptyScript: Script = { source: '', compiled: '', isCorrect: false }

const textColors: Record<string, string> = {
  'base': 'text-bg-foreground',
  'light': 'text-muted-foreground',
  'primary': 'text-primary',
  'accent': 'text-accent',
  'confirmation': 'text-success',
  'warning': 'text-warning',
  'danger': 'text-destruction',
}

const textWeights: Record<string, string> = {
  'thin': 'font-thin',
  'extralight': 'font-extralight',
  'light': 'font-light',
  'normal': 'font-normal',
  'medium': 'font-medium',
  'semibold': 'font-semibold',
  'bold': 'font-bold',
  'extrabold': 'font-extrabold',
  'black': 'font-black',
}

const textSizes: Record<string, React.CSSProperties> = {
  'xs': { fontSize: '0.75rem', lineHeight: '1rem' },
  'sm': { fontSize: '0.875rem', lineHeight: '1.25rem' },
  'base': { fontSize: '1rem', lineHeight: '1.5rem' },
  'lg': { fontSize: '1.125rem', lineHeight: '1.75rem' },
  'xl': { fontSize: '1.25rem', lineHeight: '1.75rem' },
  '2xl': { fontSize: '1.5rem', lineHeight: '2rem' },
  '3xl': { fontSize: '1.875rem', lineHeight: '2.25rem' },
  '4xl': { fontSize: '2.25rem', lineHeight: '2.5rem' },
}

// ── Editor ────────────────────────────────────────────────────────────────────

const TextRender: BlockDefinition['Render'] = ({ props }) => {
  const text = typeof props.text === 'string' ? props.text : ''
  const useScriptValue = Boolean(props.useScriptValue)

  return (
    <p
      className={`${textColors[props.color] ?? ''} ${textWeights[props.fontWeight] ?? ''}`}
      style={{ ...(textSizes[props.fontSize] ?? {}), textAlign: props.textAlign }}
    >
      {useScriptValue
        ? <span className='text-muted-foreground italic text-xs'>(script value)</span>
        : (text || <span className='text-muted-foreground italic text-xs'>Empty text</span>)
      }
    </p>
  )
}

// ── Preview ───────────────────────────────────────────────────────────────────

const TextPreview: NonNullable<BlockDefinition['Preview']> = ({ props, state, updateState }) => {
  const localData = useLocalData()
  const { isReady, runScript } = useScriptRunner()
  const [displayText, setDisplayText] = useState<string>(props.text ?? '')
  const [cacheKey, setCacheKey] = useState('')

  const scriptState = useMemo(() => ({ ...state, ...localData }), [state, localData])

  useEffect(() => {
    async function run() {
      if (!isReady) return
      if (!props.useScriptValue) return setDisplayText(props.text ?? '')
      const script: Script = props.script ?? emptyScript
      if (!script.isCorrect) return setDisplayText('Script error')
      const output = await runScript<string>(cacheKey, script, scriptState, updateState)
      setDisplayText(output.result ?? '')
      setCacheKey(output.cacheKey)
    }
    run()
  }, [props.script, props.useScriptValue, props.text, scriptState, isReady])

  const colorClass = textColors[props.color] ?? ''
  const weightClass = textWeights[props.fontWeight] ?? ''

  return (
    <p
      className={`${colorClass} ${weightClass}`}
      style={{
        ...(textSizes[props.fontSize] ?? {}),
        textAlign: props.textAlign,
        textDecoration: props.textDecoration,
        textTransform: props.textTransform,
      }}
    >
      {displayText}
    </p>
  )
}

// ── Settings ─────────────────────────────────────────────────────────────────

const TextSettings: NonNullable<BlockDefinition['Settings']> = ({ props, onChange }) => {
  const useScriptValue = Boolean(props.useScriptValue)

  return (
    <Accordion type='multiple' defaultValue={['content', 'typography']}>
      <AccordionItem value='content'>
        <AccordionTrigger>Content</AccordionTrigger>
        <AccordionContent className='flex flex-col gap-3'>
          <div className='flex items-center gap-2'>
            <Checkbox
              id='text-use-script'
              checked={useScriptValue}
              onCheckedChange={(v) => onChange({ ...props, useScriptValue: Boolean(v) })}
            />
            <Label htmlFor='text-use-script'>Use script value</Label>
          </div>
          {!useScriptValue && (
            <div className='space-y-1'>
              <Label>Text</Label>
              <Input
                value={props.text ?? ''}
                onChange={(e) => onChange({ ...props, text: e.target.value })}
              />
            </div>
          )}
          {useScriptValue && (
            <ScriptField
              label='Script'
              script={props.script ?? emptyScript}
              expectedType='string'
              onChange={(s) => onChange({ ...props, script: s })}
            />
          )}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='typography'>
        <AccordionTrigger>Typography</AccordionTrigger>
        <AccordionContent className='flex flex-col gap-3'>
          <div className='space-y-1'>
            <Label>Color</Label>
            <Select value={props.color ?? 'base'} onValueChange={(v) => onChange({ ...props, color: v })}>
              <SelectTrigger className='w-full'><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.keys(textColors).map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-1'>
            <Label>Font Size</Label>
            <Select value={props.fontSize ?? 'base'} onValueChange={(v) => onChange({ ...props, fontSize: v })}>
              <SelectTrigger className='w-full'><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.keys(textSizes).map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-1'>
            <Label>Font Weight</Label>
            <Select value={props.fontWeight ?? 'normal'} onValueChange={(v) => onChange({ ...props, fontWeight: v })}>
              <SelectTrigger className='w-full'><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.keys(textWeights).map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-1'>
            <Label>Text Align</Label>
            <Select value={props.textAlign ?? 'left'} onValueChange={(v) => onChange({ ...props, textAlign: v })}>
              <SelectTrigger className='w-full'><SelectValue /></SelectTrigger>
              <SelectContent>
                {['left', 'center', 'right', 'justify'].map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-1'>
            <Label>Text Decoration</Label>
            <Select value={props.textDecoration ?? 'none'} onValueChange={(v) => onChange({ ...props, textDecoration: v })}>
              <SelectTrigger className='w-full'><SelectValue /></SelectTrigger>
              <SelectContent>
                {['none', 'underline', 'line-through', 'overline'].map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-1'>
            <Label>Text Transform</Label>
            <Select value={props.textTransform ?? 'none'} onValueChange={(v) => onChange({ ...props, textTransform: v })}>
              <SelectTrigger className='w-full'><SelectValue /></SelectTrigger>
              <SelectContent>
                {['none', 'uppercase', 'lowercase', 'capitalize'].map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

// ── Definition ────────────────────────────────────────────────────────────────

export const textBlockDefinition: BlockDefinition = {
  type: 'text',
  label: 'Text',
  defaultProps: () => ({
    text: 'Hello world',
    useScriptValue: false,
    script: emptyScript,
    color: 'base',
    fontSize: 'base',
    fontWeight: 'normal',
    textAlign: 'left',
    textDecoration: 'none',
    textTransform: 'none',
  }),
  Render: TextRender,
  Preview: TextPreview,
  Settings: TextSettings,
}
