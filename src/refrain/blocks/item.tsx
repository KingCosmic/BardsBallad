import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type { BlockDefinition } from '../context/BlockRegistryContext'
import { useLocalData } from '../context/LocalDataContext'
import { useScriptRunner } from '@/components/providers/script-runner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ScriptField } from '../components/ScriptField'
import type { Script } from '@/types/script'

const emptyScript: Script = { source: '', compiled: '', isCorrect: false }

const ItemRender: BlockDefinition['Render'] = ({ props }) => {
  return (
    <div className='rounded-lg border p-3 space-y-2'>
      <p className='font-semibold'>{props.title ?? 'Item'}</p>
      {props.showDescription && (
        <p className='text-sm text-muted-foreground'>{props.description ?? ''}</p>
      )}
      {props.showActionButton && (
        <Button type='button' size='sm'>{props.actionLabel ?? 'Action'}</Button>
      )}
    </div>
  )
}

const ItemPreview: NonNullable<BlockDefinition['Preview']> = ({ props, state, updateState }) => {
  const localData = useLocalData()
  const { isReady, runScript } = useScriptRunner()

  const [title, setTitle] = useState<string>(props.title ?? 'Item')
  const [description, setDescription] = useState<string>(props.description ?? '')

  const scriptState = useMemo(() => ({ ...state, ...localData }), [state, localData])

  useEffect(() => {
    async function run() {
      if (!props.useTitleScript || !isReady) return setTitle(props.title ?? 'Item')
      const script: Script = props.titleScript ?? emptyScript
      if (!script.isCorrect) return setTitle(props.title ?? 'Item')
      const output = await runScript<string>(undefined, script, scriptState, updateState)
      setTitle(output.result ?? props.title ?? 'Item')
    }
    run()
  }, [props.useTitleScript, props.titleScript, props.title, scriptState, isReady])

  useEffect(() => {
    async function run() {
      if (!props.useDescriptionScript || !isReady) return setDescription(props.description ?? '')
      const script: Script = props.descriptionScript ?? emptyScript
      if (!script.isCorrect) return setDescription(props.description ?? '')
      const output = await runScript<string>(undefined, script, scriptState, updateState)
      setDescription(output.result ?? props.description ?? '')
    }
    run()
  }, [props.useDescriptionScript, props.descriptionScript, props.description, scriptState, isReady])

  const handleClick = useCallback(() => {
    if (!props.showActionButton || !isReady) return
    const script: Script = props.onClick ?? emptyScript
    if (!script.isCorrect) return
    runScript<null>(undefined, script, scriptState, updateState)
  }, [props.showActionButton, props.onClick, scriptState, isReady])

  return (
    <div className='rounded-lg border p-3 space-y-2'>
      <p className='font-semibold'>{title}</p>
      {props.showDescription && description && (
        <p className='text-sm text-muted-foreground'>{description}</p>
      )}
      {props.showActionButton && (
        <Button type='button' size='sm' onClick={handleClick}>{props.actionLabel ?? 'Action'}</Button>
      )}
    </div>
  )
}

const ItemSettings: NonNullable<BlockDefinition['Settings']> = ({ props, onChange }) => {
  const set = (patch: Record<string, any>) => onChange({ ...props, ...patch })

  return (
    <Accordion type='multiple' defaultValue={['content', 'scripts', 'action']}>
      <AccordionItem value='content'>
        <AccordionTrigger>Content</AccordionTrigger>
        <AccordionContent className='flex flex-col gap-3'>
          <div className='space-y-1'>
            <Label>Title</Label>
            <Input value={props.title ?? ''} onChange={(e) => set({ title: e.target.value })} />
          </div>

          <div className='flex items-center gap-2'>
            <Checkbox
              id='item-show-description'
              checked={Boolean(props.showDescription)}
              onCheckedChange={(v) => set({ showDescription: Boolean(v) })}
            />
            <Label htmlFor='item-show-description'>Show Description</Label>
          </div>

          {props.showDescription && (
            <div className='space-y-1'>
              <Label>Description</Label>
              <Input value={props.description ?? ''} onChange={(e) => set({ description: e.target.value })} />
            </div>
          )}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='scripts'>
        <AccordionTrigger>Scripts</AccordionTrigger>
        <AccordionContent className='flex flex-col gap-3'>
          <div className='flex items-center gap-2'>
            <Checkbox
              id='item-use-title-script'
              checked={Boolean(props.useTitleScript)}
              onCheckedChange={(v) => set({ useTitleScript: Boolean(v) })}
            />
            <Label htmlFor='item-use-title-script'>Use Title Script</Label>
          </div>

          {props.useTitleScript && (
            <ScriptField
              label='Get Title'
              script={props.titleScript ?? emptyScript}
              expectedType='string'
              onChange={(s) => set({ titleScript: s })}
            />
          )}

          <div className='flex items-center gap-2'>
            <Checkbox
              id='item-use-description-script'
              checked={Boolean(props.useDescriptionScript)}
              onCheckedChange={(v) => set({ useDescriptionScript: Boolean(v) })}
            />
            <Label htmlFor='item-use-description-script'>Use Description Script</Label>
          </div>

          {props.useDescriptionScript && (
            <ScriptField
              label='Get Description'
              script={props.descriptionScript ?? emptyScript}
              expectedType='string'
              onChange={(s) => set({ descriptionScript: s })}
            />
          )}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='action'>
        <AccordionTrigger>Action</AccordionTrigger>
        <AccordionContent className='flex flex-col gap-3'>
          <div className='flex items-center gap-2'>
            <Checkbox
              id='item-show-action'
              checked={Boolean(props.showActionButton)}
              onCheckedChange={(v) => set({ showActionButton: Boolean(v) })}
            />
            <Label htmlFor='item-show-action'>Show Action Button</Label>
          </div>

          {props.showActionButton && (
            <>
              <div className='space-y-1'>
                <Label>Action Label</Label>
                <Input value={props.actionLabel ?? ''} onChange={(e) => set({ actionLabel: e.target.value })} />
              </div>

              <ScriptField
                label='On Click'
                script={props.onClick ?? emptyScript}
                expectedType='null'
                onChange={(s) => set({ onClick: s })}
              />
            </>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export const itemBlockDefinition: BlockDefinition = {
  type: 'item',
  label: 'Item',
  defaultProps: () => ({
    title: 'Item',
    description: '',
    showDescription: true,
    useTitleScript: false,
    titleScript: emptyScript,
    useDescriptionScript: false,
    descriptionScript: emptyScript,
    showActionButton: false,
    actionLabel: 'Action',
    onClick: emptyScript,
  }),
  Render: ItemRender,
  Preview: ItemPreview,
  Settings: ItemSettings,
}
