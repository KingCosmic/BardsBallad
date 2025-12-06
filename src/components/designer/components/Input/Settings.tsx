import { useNode } from '@craftjs/core'
import { useEffect, useMemo } from 'react'
import { useLocalState } from '../../hooks/useLocalState'
import { editorState } from '@/state/editor'
import { useVersionEdits } from '@/hooks/versions/useVersionEdits'
import { SystemData, SystemType } from '@/db/system/schema'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { openModal } from '@/state/modals'
import ScriptEditor from '@/modals/editors/script-editor'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import globalStyles from '../../styles'

export function SelectSettings() {
  const { id, actions: { setProp },
    type,
    minNumber, maxNumber,

    getValue, onChange,

    marginTop, marginRight, marginBottom, marginLeft,
    width, maxWidth, minWidth
  } = useNode(node => ({
    type: node.data.props.type,

    minNumber: node.data.props.minNumber,
    maxNumber: node.data.props.maxNumber,

    getValue: node.data.props.getValue,
    onChange: node.data.props.onChange,

    marginTop: node.data.props.marginTop,
    marginRight: node.data.props.marginRight,
    marginBottom: node.data.props.marginBottom,
    marginLeft: node.data.props.marginLeft,
    width: node.data.props.width,
    maxWidth: node.data.props.maxWidth,
    minWidth: node.data.props.minWidth
  }))

  const localParams = useLocalState(id)
  useEffect(() => {
    setProp((props: any) => {
      props.local = [
        { name: 'inputValue', type: (type === 'text') ? 'string' : 'number', isArray: false }
      ]
    })
  }, [type])

  const editor = editorState.useValue()
  const versionEdits = useVersionEdits<SystemData>(editor.versionId)

  const types: SystemType[] = useMemo(() => [
    versionEdits?.data.defaultCharacterData._type,
    ...(versionEdits?.data.types ?? [])
  ], [versionEdits])

  return (
    <Accordion
      type='multiple'
      className='w-full'
      defaultValue={['data']}
    >
      <AccordionItem value='data'>
        <AccordionTrigger>Data Input</AccordionTrigger>
        <AccordionContent className='flex flex-col gap-4 text-balance'>

          <Label>Type</Label>
          <Select value={type} onValueChange={val => setProp((props: any) => props.type = val)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select Type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='text'>Text</SelectItem>
              <SelectItem value='number'>Number</SelectItem>
            </SelectContent>
          </Select>

          {type === 'number' && (
            <>
              <Label>Min</Label>
              <Input type='number' value={minNumber} onChange={val => setProp((props: any) => props.minNumber = val.currentTarget.value)} />

              <Label>Max</Label>
              <Input type='number' value={maxNumber} onChange={val => setProp((props: any) => props.maxNumber = val.currentTarget.value)} />
            </>
          )}

          <Button variant='outline' onClick={() => {
            openModal('script', ({ id }) => (
              <ScriptEditor id={id} code={getValue}
                onSave={({ result }) => setProp((props: any) => props.getValue = result)}
                globals={localParams} expectedType='string' types={types}
              />
            ))
          }}>
            Get Value
          </Button>

          <Button variant='outline' onClick={() => {
            openModal('script', ({ id }) => (
              <ScriptEditor id={id} code={onChange}
                onSave={({ result }) => setProp((props: any) => props.onChange = result)}
                globals={localParams} expectedType='null' types={types}
              />
            ))
          }}>
            On Change
          </Button>

        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='spacing'>
        <AccordionTrigger>Spacing</AccordionTrigger>
        <AccordionContent className='flex flex-col gap-4 text-balance'>

          <Label>Margin Top</Label>
          <Select value={marginTop} onValueChange={val => setProp((props: any) => props.marginTop = val)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select Margin' />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(globalStyles.spacing).map(style => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label>Margin Right</Label>
          <Select value={marginRight} onValueChange={val => setProp((props: any) => props.marginRight = val)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select Margin' />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(globalStyles.spacing).map(style => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label>Margin Bottom</Label>
          <Select value={marginBottom} onValueChange={val => setProp((props: any) => props.marginBottom = val)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select Margin' />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(globalStyles.spacing).map(style => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label>Margin Left</Label>
          <Select value={marginLeft} onValueChange={val => setProp((props: any) => props.marginLeft = val)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select Margin' />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(globalStyles.spacing).map(style => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label>Width</Label>
          <Select value={width} onValueChange={val => setProp((props: any) => props.width = val)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select Width' />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(globalStyles.size).map(style => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label>Max Width</Label>
          <Select value={maxWidth} onValueChange={val => setProp((props: any) => props.maxWidth = val)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select Max Width' />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(globalStyles.size).map(style => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label>Min Width</Label>
          <Select value={minWidth} onValueChange={val => setProp((props: any) => props.minWidth = val)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select Min Width' />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(globalStyles.size).map(style => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
