import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { BlockDefinition } from '../context/BlockRegistryContext'
import { BlockRegistryProvider, useBlockRegistry } from '../context/BlockRegistryContext'
import { EditorProvider, useEditor } from '../context/EditorContext'
import { LocalDataProvider, useLocalData } from '../context/LocalDataContext'
import { useViewerState } from '../context/ViewerContext'
import { useScriptRunner } from '@/components/providers/script-runner'
import { EditorCanvas } from '../components/EditorCanvas'
import { ViewerCanvas } from '../components/ViewerCanvas'
import type { Block } from '../types'
import type { Script } from '@/types/script'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ScriptField } from '../components/ScriptField'

const emptyScript: Script = { source: '', compiled: '', isCorrect: false }

const containerStyles: Record<string, { background: string; border: string; hover: string }> = {
  'no style': { background: '', border: '', hover: '' },
  'light': { background: 'bg-muted text-muted-foreground', border: 'border', hover: 'cursor-pointer hover:bg-muted/70' },
  'primary': { background: 'bg-primary text-primary-foreground', border: 'border', hover: 'cursor-pointer hover:bg-primary/70' },
  'accent': { background: 'bg-accent text-accent-foreground', border: 'border', hover: 'cursor-pointer hover:bg-accent/70' },
  'confirmation': { background: 'bg-success text-success-foreground', border: 'border', hover: 'cursor-pointer hover:bg-success/70' },
  'warning': { background: 'bg-warning text-warning-foreground', border: 'border', hover: 'cursor-pointer hover:bg-warning/70' },
}

const spacing: Record<string, string> = {
  '0': '0px', 'px': '1px', '0.5': '0.125rem', '1': '0.25rem', '1.5': '0.375rem',
  '2': '0.5rem', '2.5': '0.625rem', '3': '0.875rem', '4': '1rem', '5': '1.25rem',
  '6': '1.5rem', '7': '1.75rem', '8': '2rem', '9': '2.25rem', '10': '2.5rem',
  '11': '2.75rem', '12': '3rem', '14': '3.5rem', '16': '4rem', '20': '5rem',
  '24': '6rem', '28': '7rem', '32': '8rem',
}

const sizes: Record<string, string> = {
  'auto': 'auto', 'full': '100%', 'half': '50%', 'third': '33%', ...spacing,
}

// ── Nested editor: syncs inner blocks back to parent props ────────────────────

const NestedEditor: React.FC<{
  parentProps: Record<string, any>
  onChange: (props: Record<string, any>) => void
  innerStyle?: React.CSSProperties
}> = ({ parentProps, onChange, innerStyle }) => {
  const { blocks } = useEditor()

  // Sync nested blocks up to parent props whenever they change
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    onChange({ ...parentProps, children: blocks })
  }, [blocks])

  return (
    <EditorCanvas
      className='my-0! px-0!'
      innerStyle={innerStyle}
    />
  )
}

// ── Editor ────────────────────────────────────────────────────────────────────

const ContainerRender: BlockDefinition['Render'] = ({ props, onChange }) => {
  const registry = useBlockRegistry()
  const children: Block[] = Array.isArray(props.children) ? props.children : []

  const backgroundClass = containerStyles[props.background]?.background ?? ''
  const borderClass = containerStyles[props.border]?.border ?? ''

  // Mirror the actual layout so the editor canvas reflects the real output.
  const innerStyle: React.CSSProperties = {
    display: props.display ?? 'flex',
    flexDirection: props.flexDirection ?? 'column',
    alignItems: props.alignItems,
    justifyContent: props.justifyContent,
    flexWrap: (props.display === 'flex' || !props.display) ? 'wrap' : undefined,
    gap: spacing[props.gap] ?? undefined,
    paddingTop: spacing[props.paddingTop] ?? undefined,
    paddingRight: spacing[props.paddingRight] ?? undefined,
    paddingBottom: spacing[props.paddingBottom] ?? undefined,
    paddingLeft: spacing[props.paddingLeft] ?? undefined,
    minHeight: '3rem',
    width: sizes[props.width] ?? '100%',
  }

  return (
    <div className={`rounded-lg overflow-hidden ${backgroundClass} ${borderClass}`}>
      <div className='text-xs text-muted-foreground px-2 pt-1.5 pb-0 opacity-50 select-none'>Container</div>
      <BlockRegistryProvider definitions={registry.definitions}>
        <EditorProvider initialBlocks={children}>
          <NestedEditor parentProps={props} onChange={onChange} innerStyle={innerStyle} />
        </EditorProvider>
      </BlockRegistryProvider>
    </div>
  )
}

// ── Preview ───────────────────────────────────────────────────────────────────

const ContainerPreview: NonNullable<BlockDefinition['Preview']> = ({ props, state, updateState }) => {
  const localData = useLocalData()
  const { isReady, runScript } = useScriptRunner()

  const scriptState = useMemo(() => ({ ...state, ...localData }), [state, localData])

  const [items, setItems] = useState<any[]>([])
  const [itemCacheKey, setItemCacheKey] = useState('')
  const [isVisible, setIsVisible] = useState<boolean>(props.isVisible ?? true)
  const [visibilityCacheKey, setVisibilityCacheKey] = useState('')

  const listScript: Script = props.script ?? emptyScript
  const visibilityScript: Script = props.visibilityScript ?? emptyScript

  useEffect(() => {
    async function run() {
      if (!props.isList || !isReady) return setItems([])
      if (!listScript.isCorrect) return setItems([])
      const output = await runScript<any[]>(itemCacheKey, listScript, scriptState, updateState)
      setItems(output.result ?? [])
      setItemCacheKey(output.cacheKey)
    }
    run()
  }, [scriptState, props.isList, props.script, isReady])

  useEffect(() => {
    async function run() {
      if (!props.dynamicVisibility || !isReady) return setIsVisible(props.isVisible ?? true)
      if (!visibilityScript.isCorrect) return setIsVisible(props.isVisible ?? true)
      const output = await runScript<boolean>(visibilityCacheKey, visibilityScript, scriptState, updateState)
      setIsVisible(output.result ?? (props.isVisible ?? true))
      setVisibilityCacheKey(output.cacheKey)
    }
    run()
  }, [scriptState, props.dynamicVisibility, props.visibilityScript, props.isVisible, isReady])

  const onPress = useCallback(() => {
    if (!props.isInteractive || !isReady) return
    const pressScript: Script = props.onPress ?? emptyScript
    if (!pressScript.isCorrect) return
    runScript(undefined, pressScript, scriptState, updateState)
  }, [props.isInteractive, props.onPress, scriptState, isReady])

  const backgroundClass = containerStyles[props.background]?.background ?? ''
  const borderClass = containerStyles[props.border]?.border ?? ''
  const hoverClass = props.isInteractive ? (containerStyles[props.hover]?.hover ?? '') : ''

  const children: Block[] = Array.isArray(props.children) ? props.children : []

  const parentRef = useRef<HTMLDivElement>(null)
  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 4,
  })

  const containerStyle: React.CSSProperties = {
    display: isVisible ? (props.display ?? 'flex') : 'none',
    position: props.isList ? 'relative' : (props.position ?? 'static'),
    top: props.top,
    right: props.right,
    bottom: props.bottom,
    left: props.left,
    flexDirection: props.flexDirection ?? 'column',
    alignItems: props.alignItems,
    justifyContent: props.justifyContent,
    gap: spacing[props.gap] ?? undefined,
    marginTop: spacing[props.marginTop] ?? undefined,
    marginRight: spacing[props.marginRight] ?? undefined,
    marginBottom: spacing[props.marginBottom] ?? undefined,
    marginLeft: spacing[props.marginLeft] ?? undefined,
    ...(props.isList ? {} : {
      paddingTop: spacing[props.paddingTop] ?? undefined,
      paddingRight: spacing[props.paddingRight] ?? undefined,
      paddingBottom: spacing[props.paddingBottom] ?? undefined,
      paddingLeft: spacing[props.paddingLeft] ?? undefined,
    }),
    height: props.isList
      ? `${rowVirtualizer.getTotalSize() + items.length * 8}px`
      : (sizes[props.height] ?? undefined),
    width: props.isList ? undefined : (sizes[props.width] ?? undefined),
    maxHeight: sizes[props.maxHeight] ?? undefined,
    maxWidth: sizes[props.maxWidth] ?? undefined,
    minHeight: sizes[props.minHeight] ?? undefined,
    minWidth: sizes[props.minWidth] ?? undefined,
  }

  return (
    <div
      ref={parentRef}
      style={containerStyle}
      className={`${backgroundClass} ${borderClass} ${hoverClass} rounded-lg`}
      onClick={onPress}
    >
      {props.isList ? (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          paddingTop: spacing[props.paddingTop] ?? undefined,
          paddingRight: spacing[props.paddingRight] ?? undefined,
          paddingBottom: spacing[props.paddingBottom] ?? undefined,
          paddingLeft: spacing[props.paddingLeft] ?? undefined,
          width: '100%',
          transform: `translateY(${items[0]?.start ?? 8}px)`,
          display: props.display ?? 'flex',
          flexDirection: props.flexDirection ?? 'column',
          gap: spacing[props.gap] ?? undefined,
        }}>
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const item = items[virtualItem.index]
            return (
              <div key={virtualItem.key} data-index={virtualItem.index} ref={rowVirtualizer.measureElement}>
                <LocalDataProvider data={{ [props.dataName ?? 'item']: item }}>
                  <ViewerCanvas blocks={children} />
                </LocalDataProvider>
              </div>
            )
          })}
        </div>
      ) : (
        <ViewerCanvas blocks={children} />
      )}
    </div>
  )
}

// ── Settings ─────────────────────────────────────────────────────────────────

const SPACING_KEYS = Object.keys(spacing)
const SIZE_KEYS = Object.keys(sizes)
const STYLE_KEYS = Object.keys(containerStyles)

const ContainerSettings: NonNullable<BlockDefinition['Settings']> = ({ props, onChange }) => {
  const set = (patch: Record<string, any>) => onChange({ ...props, ...patch })

  return (
    <Accordion type='multiple' defaultValue={['layout']}>
      <AccordionItem value='layout'>
        <AccordionTrigger>Layout</AccordionTrigger>
        <AccordionContent className='flex flex-col gap-3'>
          <div className='space-y-1'>
            <Label>Display</Label>
            <Select value={props.display ?? 'flex'} onValueChange={(v) => set({ display: v })}>
              <SelectTrigger className='w-full'><SelectValue /></SelectTrigger>
              <SelectContent>
                {['flex', 'grid', 'block', 'inline-flex', 'inline-block'].map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-1'>
            <Label>Direction</Label>
            <Select value={props.flexDirection ?? 'column'} onValueChange={(v) => set({ flexDirection: v })}>
              <SelectTrigger className='w-full'><SelectValue /></SelectTrigger>
              <SelectContent>
                {['row', 'column', 'row-reverse', 'column-reverse'].map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-1'>
            <Label>Align Items</Label>
            <Select value={props.alignItems ?? 'flex-start'} onValueChange={(v) => set({ alignItems: v })}>
              <SelectTrigger className='w-full'><SelectValue /></SelectTrigger>
              <SelectContent>
                {['flex-start', 'center', 'flex-end', 'stretch', 'baseline'].map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-1'>
            <Label>Justify Content</Label>
            <Select value={props.justifyContent ?? 'flex-start'} onValueChange={(v) => set({ justifyContent: v })}>
              <SelectTrigger className='w-full'><SelectValue /></SelectTrigger>
              <SelectContent>
                {['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'].map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-1'>
            <Label>Gap</Label>
            <Select value={props.gap ?? '0'} onValueChange={(v) => set({ gap: v })}>
              <SelectTrigger className='w-full'><SelectValue /></SelectTrigger>
              <SelectContent>
                {SPACING_KEYS.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='sizing'>
        <AccordionTrigger>Sizing</AccordionTrigger>
        <AccordionContent className='grid grid-cols-2 gap-3'>
          {['width', 'height', 'maxWidth', 'maxHeight', 'minWidth', 'minHeight'].map((key) => (
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
        <AccordionContent>
          <p className='text-xs text-muted-foreground mb-2'>Margin</p>
          <div className='grid grid-cols-2 gap-3 mb-4'>
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
          </div>
          <p className='text-xs text-muted-foreground mb-2'>Padding</p>
          <div className='grid grid-cols-2 gap-3'>
            {['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'].map((key) => (
              <div key={key} className='space-y-1'>
                <Label className='capitalize'>{key.replace('padding', '')}</Label>
                <Select value={props[key] ?? '0'} onValueChange={(v) => set({ [key]: v })}>
                  <SelectTrigger className='w-full'><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SPACING_KEYS.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='position'>
        <AccordionTrigger>Position</AccordionTrigger>
        <AccordionContent className='flex flex-col gap-3'>
          <div className='space-y-1'>
            <Label>Position</Label>
            <Select value={props.position ?? 'static'} onValueChange={(v) => set({ position: v })}>
              <SelectTrigger className='w-full'><SelectValue /></SelectTrigger>
              <SelectContent>
                {['static', 'relative', 'absolute', 'fixed', 'sticky'].map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {['top', 'right', 'bottom', 'left'].map((key) => (
            <div key={key} className='space-y-1'>
              <Label className='capitalize'>{key}</Label>
              <Input
                value={props[key] ?? ''}
                placeholder='e.g. 0px'
                onChange={(e) => set({ [key]: e.target.value || undefined })}
              />
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='styling'>
        <AccordionTrigger>Styling</AccordionTrigger>
        <AccordionContent className='flex flex-col gap-3'>
          {['background', 'border', 'hover'].map((key) => (
            <div key={key} className='space-y-1'>
              <Label className='capitalize'>{key}</Label>
              <Select value={props[key] ?? 'no style'} onValueChange={(v) => set({ [key]: v })}>
                <SelectTrigger className='w-full'><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STYLE_KEYS.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='interaction'>
        <AccordionTrigger>Interaction</AccordionTrigger>
        <AccordionContent className='flex flex-col gap-3'>
          <div className='flex items-center gap-2'>
            <Checkbox
              id='container-interactive'
              checked={Boolean(props.isInteractive)}
              onCheckedChange={(v) => set({ isInteractive: Boolean(v) })}
            />
            <Label htmlFor='container-interactive'>Is Interactive</Label>
          </div>
          {props.isInteractive && (
            <ScriptField
              label='On Press'
              script={props.onPress ?? { source: '', compiled: '', isCorrect: false }}
              expectedType='null'
              onChange={(s) => set({ onPress: s })}
            />
          )}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='list'>
        <AccordionTrigger>List</AccordionTrigger>
        <AccordionContent className='flex flex-col gap-3'>
          <div className='flex items-center gap-2'>
            <Checkbox
              id='container-islist'
              checked={Boolean(props.isList)}
              onCheckedChange={(v) => set({ isList: Boolean(v) })}
            />
            <Label htmlFor='container-islist'>Is List</Label>
          </div>
          {props.isList && (
            <>
              <div className='space-y-1'>
                <Label>Data Name</Label>
                <Input
                  value={props.dataName ?? 'item'}
                  onChange={(e) => set({ dataName: e.target.value })}
                />
              </div>
              <ScriptField
                label='Data Source'
                script={props.script ?? { source: '', compiled: '', isCorrect: false }}
                expectedType='array'
                onChange={(s) => set({ script: s })}
              />
            </>
          )}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='visibility'>
        <AccordionTrigger>Visibility</AccordionTrigger>
        <AccordionContent className='flex flex-col gap-3'>
          <div className='flex items-center gap-2'>
            <Checkbox
              id='container-visible'
              checked={props.isVisible ?? true}
              onCheckedChange={(v) => set({ isVisible: Boolean(v) })}
            />
            <Label htmlFor='container-visible'>Visible</Label>
          </div>
          <div className='flex items-center gap-2'>
            <Checkbox
              id='container-dyn-visibility'
              checked={Boolean(props.dynamicVisibility)}
              onCheckedChange={(v) => set({ dynamicVisibility: Boolean(v) })}
            />
            <Label htmlFor='container-dyn-visibility'>Dynamic Visibility</Label>
          </div>
          {props.dynamicVisibility && (
            <ScriptField
              label='Visibility Script'
              script={props.visibilityScript ?? { source: '', compiled: '', isCorrect: false }}
              expectedType='bool'
              onChange={(s) => set({ visibilityScript: s })}
            />
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

// ── Definition ────────────────────────────────────────────────────────────────

export const containerBlockDefinition: BlockDefinition = {
  type: 'container',
  label: 'Container',
  defaultProps: () => ({
    children: [],
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    position: 'static',
    top: undefined,
    right: undefined,
    bottom: undefined,
    left: undefined,
    gap: '2',
    marginTop: '0',
    marginRight: '0',
    marginBottom: '0',
    marginLeft: '0',
    paddingTop: '2',
    paddingRight: '2',
    paddingBottom: '2',
    paddingLeft: '2',
    height: 'auto',
    width: 'full',
    maxHeight: undefined,
    maxWidth: undefined,
    minHeight: undefined,
    minWidth: undefined,
    background: 'no style',
    border: 'no style',
    hover: 'no style',
    isInteractive: false,
    onPress: { source: '', compiled: '', isCorrect: false },
    isList: false,
    dataName: 'item',
    script: { source: '', compiled: '', isCorrect: false },
    dynamicVisibility: false,
    visibilityScript: { source: '', compiled: '', isCorrect: false },
    isVisible: true,
  }),
  Render: ContainerRender,
  Preview: ContainerPreview,
  Settings: ContainerSettings,
}
