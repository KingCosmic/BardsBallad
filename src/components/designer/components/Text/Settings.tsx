import { useMemo } from 'react'
import { useNode } from '@craftjs/core'
import styles from './styles'
import { useLocalState } from '../../hooks/useLocalState'
import { editorState } from '@/state/editor'
import { useVersionEdits } from '@/hooks/versions/useVersionEdits'
import { SystemData, SystemType } from '@/db/system/schema'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { openModal } from '@/state/modals'
import ScriptEditor from '@/modals/editors/script-editor'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import globalStyles from '../../styles'

export default function TextSettings() {
  const { id, actions: { setProp },
    useScriptValue, script,
    text, color,
    fontSize, fontWeight,
    textAlign, textDecoration, textTransform,
    marginTop, marginRight, marginBottom, marginLeft,
    paddingTop, paddingRight, paddingBottom, paddingLeft,
  } = useNode(node => ({
    useScriptValue: node.data.props.useScriptValue || false,
    script: node.data.props.script,

    text: node.data.props.text || '',
    color: node.data.props.color,
    fontFamily: node.data.props.fontFamily,
    fontSize: node.data.props.fontSize,
    fontWeight: node.data.props.fontWeight,
    fontStyle: node.data.props.fontStyle,
    letterSpacing: node.data.props.letterSpacing,
    lineHeight: node.data.props.lineHeight,
    textAlign: node.data.props.textAlign || 'left',
    textDecoration: node.data.props.textDecoration || 'none',
    textTransform: node.data.props.textTransform || 'none',
    marginTop: node.data.props.marginTop || '0px',
    marginRight: node.data.props.marginRight || '0px',
    marginBottom: node.data.props.marginBottom || '0px',
    marginLeft: node.data.props.marginLeft || '0px',
    paddingTop: node.data.props.paddingTop || '0px',
    paddingRight: node.data.props.paddingRight || '0px',
    paddingBottom: node.data.props.paddingBottom || '0px',
    paddingLeft: node.data.props.paddingLeft || '0px',
  }))

  const localParams = useLocalState(id)

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
      defaultValue={['content']}
    >
      <AccordionItem value='content'>
        <AccordionTrigger>Content</AccordionTrigger>
        <AccordionContent className='flex flex-col gap-4 text-balance'>

          <Checkbox checked={useScriptValue} onCheckedChange={val=> setProp((props: any) => props.useScriptValue = val.valueOf())} />
          <Label>Use Script Value?</Label>

          {
            useScriptValue ? (
              <Button variant='outline' onClick={() => {
                // provide both the state and the local params passed down by the parent components
                openModal('script', ({ id }) => (
                  <ScriptEditor id={id} code={script} expectedType='string'
                    onSave={({ result }) => setProp((props: any) => props.script = result)}
                    globals={localParams} types={types}
                  />
                ))
              }}>
                Edit Script Value
              </Button>
            ) : (
              <div>
                <Label>Text</Label>
                <Input placeholder='lorem ipsum' value={text} onChange={val => setProp((props: any) => props.text = val.currentTarget.value)} />
              </div>
            )
          }
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='content'>
        <AccordionTrigger>Content</AccordionTrigger>
        <AccordionContent className='flex flex-col gap-4 text-balance'>

          <Checkbox checked={useScriptValue} onCheckedChange={val=> setProp((props: any) => props.useScriptValue = val.valueOf())} />
          <Label>Use Script Value?</Label>

          {
            useScriptValue ? (
              <Button variant='outline' onClick={() => {
                // provide both the state and the local params passed down by the parent components
                openModal('script', ({ id }) => (
                  <ScriptEditor id={id} code={script} expectedType='string'
                    onSave={({ result }) => setProp((props: any) => props.script = result)}
                    globals={localParams} types={types}
                  />
                ))
              }}>
                Edit Script Value
              </Button>
            ) : (
              <div>
                <Label>Text</Label>
                <Input placeholder='lorem ipsum' value={text} onChange={val => setProp((props: any) => props.text = val.currentTarget.value)} />
              </div>
            )
          }
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='styling'>
        <AccordionTrigger>Styling</AccordionTrigger>
        <AccordionContent>

          <Label>Color</Label>
          <Select value={color} onValueChange={val => setProp((props: any) => props.color = val)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select Color' />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(styles.colors).map(style => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label>Font Size</Label>
          <Select value={fontSize} onValueChange={val => setProp((props: any) => props.fontSize = val)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select Font Size' />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(styles.sizes).map(style => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label>Font Weight</Label>
          <Select value={fontWeight} onValueChange={val => setProp((props: any) => props.fontWeight = val)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select Font Weight' />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(styles.weight).map(style => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label>Text Align</Label>
          <Select value={textAlign} onValueChange={val => setProp((props: any) => props.textAlign = val)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select Alignment' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='left'>Left</SelectItem>
              <SelectItem value='center'>Center</SelectItem>
              <SelectItem value='right'>Right</SelectItem>
            </SelectContent>
          </Select>

          <Label>Text Decoration</Label>
          <Select value={textDecoration} onValueChange={val => setProp((props: any) => props.textDecoration = val)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select Alignment' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='none'>None</SelectItem>
              <SelectItem value='underline'>Underline</SelectItem>
              <SelectItem value='line-through'>Line-Through</SelectItem>
            </SelectContent>
          </Select>

          <Label>Text Transform</Label>
          <Select value={textTransform} onValueChange={val => setProp((props: any) => props.textTransform = val)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select Alignment' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='none'>None</SelectItem>
              <SelectItem value='uppercase'>Uppercase</SelectItem>
              <SelectItem value='lowercase'>Lowercase</SelectItem>
            </SelectContent>
          </Select>

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

          <Label>Padding Top</Label>
          <Select value={paddingTop} onValueChange={val => setProp((props: any) => props.paddingTop = val)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select Padding' />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(globalStyles.spacing).map(style => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label>Padding Right</Label>
          <Select value={paddingRight} onValueChange={val => setProp((props: any) => props.paddingRight = val)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select Padding' />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(globalStyles.spacing).map(style => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label>Padding Bottom</Label>
          <Select value={paddingBottom} onValueChange={val => setProp((props: any) => props.paddingBottom = val)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select Padding' />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(globalStyles.spacing).map(style => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label>Padding Left</Label>
          <Select value={paddingLeft} onValueChange={val => setProp((props: any) => props.paddingLeft = val)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select Padding' />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(globalStyles.spacing).map(style => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>

        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
