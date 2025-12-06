import { useNode } from '@craftjs/core'
import { useMemo } from 'react'
import styles from './styles'
import { useLocalState } from '../../hooks/useLocalState'
import { editorState } from '@/state/editor'
import { useVersionEdits } from '@/hooks/versions/useVersionEdits'
import { SystemData, SystemType } from '@/db/system/schema'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { openModal } from '@/state/modals'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import globalStyles from '../../styles'
import ScriptEditor from '@/modals/editors/script-editor'

export function ContainerSettings() {
  const { id, actions: { setProp },
    isVisible, dynamicVisibility, visibilityScript,
    isList, dataName, script, returnType,
    isInteractive, onPress,
    display, position, top, right, bottom, left,
    flexDirection, alignItems, justifyContent, gap,
    rows, columns,
    marginTop, marginRight, marginBottom, marginLeft,
    paddingTop, paddingRight, paddingBottom, paddingLeft,
    height, width, maxHeight, maxWidth, minHeight, minWidth,
    background, border, hover
  } = useNode(node => ({
    showPlaceholder: node.data.props.showPlaceholder,
    isVisible: node.data.props.isVisible,

    dynamicVisibility: node.data.props.dynamicVisibility,
    visibilityScript: node.data.props.visibilityScript,

    isList: node.data.props.isList,
    dataName: node.data.props.dataName,
    script: node.data.props.script,
    returnType: node.data.props.returnType,
    
    isInteractive: node.data.props.isInteractive,
    onPress: node.data.props.onPress,

    display: node.data.props.display,
    position: node.data.props.position,
    top: node.data.props.top,
    right: node.data.props.right,
    bottom: node.data.props.bottom,
    left: node.data.props.left,
    flexDirection: node.data.props.flexDirection,
    alignItems: node.data.props.alignItems,
    justifyContent: node.data.props.justifyContent,
    gap: node.data.props.gap,
    rows: node.data.props.rows,
    columns: node.data.props.columns,
    marginTop: node.data.props.marginTop,
    marginRight: node.data.props.marginRight,
    marginBottom: node.data.props.marginBottom,
    marginLeft: node.data.props.marginLeft,
    paddingTop: node.data.props.paddingTop,
    paddingRight: node.data.props.paddingRight,
    paddingBottom: node.data.props.paddingBottom,
    paddingLeft: node.data.props.paddingLeft,
    height: node.data.props.height,
    width: node.data.props.width,
    maxHeight: node.data.props.maxHeight,
    maxWidth: node.data.props.maxWidth,
    minHeight: node.data.props.minHeight,
    minWidth: node.data.props.minWidth,

    background: node.data.props.background,
    border: node.data.props.border,
    hover: node.data.props.hover
  }))

  const localParams = useLocalState(id)

  const editor = editorState.useValue()
  const versionEdits = useVersionEdits<SystemData>(editor.versionId)

  const types: SystemType[] = useMemo(() => [
    // character data
    versionEdits?.data.defaultCharacterData._type,
    // system data
    { name: 'SystemData', properties: versionEdits?.data.data.map(d => ({ key: d.name, typeData: d.typeData })) },
    // "page data",
    { name: 'PageData', properties: [] },
    // all custom types.
    ...(versionEdits?.data.types ?? [])
  ], [versionEdits])

  return (
    <Accordion
      type='multiple'
      className='w-full'
      defaultValue={['visibility']}
    >
      <AccordionItem value='visibility'>
        <AccordionTrigger>Visibility</AccordionTrigger>
        <AccordionContent className='flex flex-col gap-4 text-balance'>
          <div className='flex gap-2'>
            <Checkbox checked={dynamicVisibility} onCheckedChange={val => setProp((props: any) => props.dynamicVisibility = val.valueOf())} />
            <Label>Dynamic Visibility?</Label>
          </div>
          {
            dynamicVisibility ? (
              <Button variant='outline' onClick={() => {
                openModal('script', ({ id }) => (
                  <ScriptEditor id={id} code={visibilityScript}
                    onSave={({ result }) => setProp((props: any) => props.visibilityScript = result)}
                    globals={localParams} expectedType='boolean' types={types}
                  />
                ))
              }}>
                Visibility Script
              </Button>
            ) : (
              <div className='flex gap-2'>
                <Checkbox checked={isVisible} onCheckedChange={val => setProp((props: any) => props.isVisible = val.valueOf())} />
                <Label>Visible</Label>
              </div>
            )
          }
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='list'>
        <AccordionTrigger>List</AccordionTrigger>
        <AccordionContent className='flex flex-col gap-4 text-balance'>
          <div className='flex gap-2'>
            <Checkbox checked={isList} onCheckedChange={val => {
              setProp((props: any) => {
                const newIsList = val.valueOf()
                props.isList = newIsList

                props.local = newIsList ? [
                  {
                    name: dataName,
                    type: returnType,
                    isArray: false
                  }
                ] : []

                return props
              })
            }} />
            <Label>Dynamic List?</Label>
          </div>

          <Label>Variable Name</Label>
          <Input value={dataName} onChange={val => {
            setProp((props: any) => {
              const value = val.currentTarget.value

              props.dataName = value

              const index = props.local.findIndex((localProp: any) => localProp.name === dataName)

              if (index === -1) return

              props.local[index].name = value

              return props
            })
          }} />

          <Button variant='outline' onClick={() => {
            openModal('script', ({ id }) => (
              <ScriptEditor id={id} code={script} onSave={({ result, returnType }) => {
                setProp((props: any) => {
                  props.script = result
      
                  const index = props.local.findIndex((localProp: any) => localProp.name === dataName)
      
                  if (index === -1) return
      
                  props.local[index].type = result.isCorrect ? returnType.slice(0, -2) : returnType
      
                  return props
                })
              }} globals={localParams} expectedType='any[]' types={types} />
            ))
          }}>
            List Data Script
          </Button>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='input'>
        <AccordionTrigger>Input</AccordionTrigger>
        <AccordionContent className='flex flex-col gap-4 text-balance'>
          <div className='flex gap-2'>
            <Checkbox checked={isInteractive} onCheckedChange={val => setProp((props:any) => props.isInteractive = val.valueOf())} />
            <Label>Is Interactive?</Label>
          </div>

          <Button variant='outline' onClick={() => {
          openModal('script', ({ id }) => (
            <ScriptEditor id={id} code={onPress}
              onSave={(script) => setProp((props: any) => props.onPress = script.result)}
              globals={localParams} expectedType='null' types={types}
            />
          ))
        }}>
            On Press
          </Button>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='layout'>
        <AccordionTrigger>Layout</AccordionTrigger>
        <AccordionContent className='flex flex-col gap-4 text-balance'>

          <Label>Display</Label>
          <Select value={display} onValueChange={val => setProp((props: any) => props.display = val)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Pick Display' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='block'>Block</SelectItem>
              <SelectItem value='flex'>Flex</SelectItem>
              <SelectItem value='grid'>Grid</SelectItem>
            </SelectContent>
          </Select>

          <Label>Position</Label>
          <Select value={position} onValueChange={val => setProp((props: any) => props.position = val)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select Position' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='static'>Static</SelectItem>
              <SelectItem value='relative'>Relative</SelectItem>
              <SelectItem value='absolute'>Absolute</SelectItem>
              <SelectItem value='fixed'>Fixed</SelectItem>
              <SelectItem value='sticky'>Sticky</SelectItem>
            </SelectContent>
          </Select>

          {
            (position !== 'static') ? (
              <>
                <Label>Top</Label>
                <Input value={top} onChange={val => setProp((props: any) => props.top = val.currentTarget.value)} />
                
                <Label>Right</Label>
                <Input value={right} onChange={val => setProp((props: any) => props.right = val.currentTarget.value)} />
                
                <Label>Bottom</Label>
                <Input value={bottom} onChange={val => setProp((props: any) => props.bottom = val.currentTarget.value)} />

                <Label>Left</Label>
                <Input value={left} onChange={val => setProp((props: any) => props.left = val.currentTarget.value)} />
              </>
            ) : null
          }

          {
            display === 'grid' ? (
              <>
                <Label>Columns</Label>
                <Input value={columns} onChange={val => setProp((props: any) => props.columns = val.currentTarget.value)} />
                
                <Label>Rows</Label>
                <Input value={rows} onChange={val => setProp((props: any) => props.rows = val.currentTarget.value)} />
              </>
            ) : null
          }

          {
            ['flex', 'grid'].includes(display) && (
              <>
                <Label>Flex Direction</Label>
                <Select value={flexDirection} onValueChange={val => setProp((props: any) => props.flexDirection = val)}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select Direction' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='row'>Row</SelectItem>
                    <SelectItem value='column'>Column</SelectItem>
                    <SelectItem value='row-reverse'>Reverse Row</SelectItem>
                    <SelectItem value='column-reverse'>Reverse Column</SelectItem>
                  </SelectContent>
                </Select>

                <Label>Align Items</Label>
                <Select value={alignItems} onValueChange={val => setProp((props: any) => props.alignItems = val)}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select Alignment' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='initial'>Initial</SelectItem>
                    <SelectItem value='inherit'>Inherit</SelectItem>
                    <SelectItem value='normal'>Normal</SelectItem>
                    <SelectItem value='stretch'>Stretch</SelectItem>
                    <SelectItem value='center'>Center</SelectItem>
                    <SelectItem value='flex-start'>Flex-Start</SelectItem>
                    <SelectItem value='flex-end'>Flex-End</SelectItem>
                    <SelectItem value='start'>Start</SelectItem>
                    <SelectItem value='end'>End</SelectItem>
                    <SelectItem value='baseline'>Baseline</SelectItem>
                  </SelectContent>
                </Select>

                <Label>Justify Content</Label>
                <Select value={justifyContent} onValueChange={val => setProp((props: any) => props.justifyContent = val)}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select Justification' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='initial'>Initial</SelectItem>
                    <SelectItem value='inherit'>Inherit</SelectItem>
                    <SelectItem value='stretch'>Stretch</SelectItem>
                    <SelectItem value='center'>Center</SelectItem>
                    <SelectItem value='flex-start'>Flex-Start</SelectItem>
                    <SelectItem value='flex-end'>Flex-End</SelectItem>
                    <SelectItem value='space-between'>Space-Between</SelectItem>
                    <SelectItem value='space-around'>Space-Around</SelectItem>
                    <SelectItem value='space-evenly'>Space-Evenly</SelectItem>
                  </SelectContent>
                </Select>

                <Label>Gap</Label>
                <Select value={gap} onValueChange={val => setProp((props: any) => props.gap = val)}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select Gap' />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(globalStyles.spacing).map(style => (
                      <SelectItem key={style} value={style}>{style}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )
          }
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

          <Label>Height</Label>
          <Select value={height} onValueChange={val => setProp((props: any) => props.height = val)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select Height' />
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

          <Label>Max Height</Label>
          <Select value={maxHeight} onValueChange={val => setProp((props: any) => props.maxHeight = val)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select Max Height' />
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

          <Label>Min Height</Label>
          <Select value={minHeight} onValueChange={val => setProp((props: any) => props.minHeight = val)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select Min Height' />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(globalStyles.size).map(style => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='styling'>
        <AccordionTrigger>Styling</AccordionTrigger>
        <AccordionContent className='flex flex-col gap-4 text-balance'>

          <Label>Background</Label>
          <Select value={background} onValueChange={val => setProp((props: any) => props.background = val)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select Background' />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(styles).map(style => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label>Border</Label>
          <Select value={border} onValueChange={val => setProp((props: any) => props.border = val)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select Border' />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(styles).map(style => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label>Hover</Label>
          <Select value={hover} onValueChange={val => setProp((props: any) => props.hover = val)}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select Hover' />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(styles).map(style => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>

        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
