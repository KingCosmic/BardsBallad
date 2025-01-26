import { useEffect, useState } from 'react'
import { getDefaultNodes, updateParams } from '../../../blueprints/utils'
import Accordion from '../../../components/Accordion'
import AccordionGroup from '../../../components/AccordionGroup'
import Button from '../../../components/inputs/Button'
import Checkbox from '../../../components/inputs/Checkbox'
import TextInput from '../../../components/inputs/TextInput'
import { openModal } from '../../../state/modals'
import { useNode } from '@craftjs/core'
import { useLocalState } from '../../hooks/useLocalState'

export default function TextSettings() {
  const { id, actions: { setProp },
    useBlueprintValue, blueprint,
    text, color,
    fontFamily, fontSize, fontWeight, fontStyle,
    letterSpacing, lineHeight,
    textAlign, textDecoration, textTransform,
    marginTop, marginRight, marginBottom, marginLeft,
    paddingTop, paddingRight, paddingBottom, paddingLeft,
  } = useNode(node => ({
    useBlueprintValue: node.data.props.useBlueprintValue || false,
    blueprint: node.data.props.blueprint,

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
  const [openAccordion, setOpenAccordion] = useState(-1)

  useEffect(() => {
    setProp((props: any) => {
      if (!props.blueprint) {
        props.blueprint = {
          nodes: getDefaultNodes(
            localParams,
            {
              name: 'text',
              type: 'string',
              isArray: false
            }
          ),
          edges: []
        }
      } else {
        props.blueprint.nodes = updateParams(props.blueprint.nodes, localParams)
      }
    
      return props
    })
  }, [])
  
  return (
    <AccordionGroup>
      <Accordion id='content' title='Content' isOpen={openAccordion === 0} toggleState={shouldOpen => setOpenAccordion(shouldOpen ? 0 : -1)}>
        <Checkbox id='use-blueprint-value' label='Use Blueprint Value?' checked={useBlueprintValue} onChange={(value) => setProp((props: any) => props.useBlueprintValue = value)} />

        {
          useBlueprintValue ? (
            <Button color='primary' onClick={() => openModal({
              type: 'blueprint',
              title: 'Text Value',
              data: blueprint,
              onSave: (blueprint) => setProp((props: any) => props.blueprint = Object.assign({}, blueprint))
            })}>
              Edit Blueprint Value
            </Button>
          ) : (
            <TextInput id='text' label='Text' placeholder='lorem ipsum' value={text} onChange={val => setProp((props: any) => props.text = val)} isValid errorMessage='' />
          )
        }
      </Accordion>
      <Accordion id='content-styling' title='Content Styling' isOpen={openAccordion === 1} toggleState={shouldOpen => setOpenAccordion(shouldOpen ? 1 : -1)}>
        <TextInput id='color' label='Color' placeholder='#232323' value={color} onChange={val => setProp((props: any) => props.color = val)} isValid errorMessage='' />

        <TextInput id='font-family' label='Font Family' placeholder='Arial, Times New Roman' value={fontFamily} onChange={val => setProp((props: any) => props.fontFamily = val)} isValid errorMessage='' />

        <TextInput id='font-size' label='Font Size' placeholder='23px' value={fontSize} onChange={val => setProp((props: any) => props.fontSize = val)} isValid errorMessage='' />

        <TextInput id='font-weight' label='Font Weight' placeholder='bold | 400' value={fontWeight} onChange={val => setProp((props: any) => props.fontWeight = val)} isValid errorMessage='' />

        <TextInput id='font-style' label='Font Style' placeholder='normal | italic' value={fontStyle} onChange={val => setProp((props: any) => props.fontStyle = val)} isValid errorMessage='' />

        <TextInput id='letter-spacing' label='Letter Spacing' placeholder='2px' value={letterSpacing} onChange={val => setProp((props: any) => props.letterSpacing = val)} isValid errorMessage='' />

        <TextInput id='line-height' label='Line Height' placeholder='1.5' value={lineHeight} onChange={val => setProp((props: any) => props.lineHeight = val)} isValid errorMessage='' />

        <TextInput id='text-align' label='Align' placeholder='left | center | right' value={textAlign} onChange={val => setProp((props: any) => props.textAlign = val)} isValid errorMessage='' />

        <TextInput id='text-decoration' label='Decoration' placeholder='underline | line-through | none' value={textDecoration} onChange={val => setProp((props: any) => props.textDecoration = val)} isValid errorMessage='' />

        <TextInput id='text-transform' label='Transform' placeholder='none | uppercase | lowercase' value={textTransform} onChange={val => setProp((props: any) => props.textTransform = val)} isValid errorMessage='' />
      </Accordion>

      <Accordion id='spacing' title='Spacing' isOpen={openAccordion === 2} toggleState={shouldOpen => setOpenAccordion(shouldOpen ? 2 : -1)}>
        <TextInput id='margin-top' label='Margin Top' value={marginTop} onChange={val => setProp((props: any) => props.marginTop = val)} isValid errorMessage='' />

        <TextInput id='margin-right' label='Margin Right' value={marginRight} onChange={val => setProp((props: any) => props.marginRight = val)} isValid errorMessage='' />
          
        <TextInput id='margin-bottom' label='Margin Bottom' value={marginBottom} onChange={val => setProp((props: any) => props.marginBottom = val)} isValid errorMessage='' />

        <TextInput id='margin-left' label='Margin Left' value={marginLeft} onChange={val => setProp((props: any) => props.marginLeft = val)} isValid errorMessage='' />

        <TextInput id='padding-top' label='Padding Top' value={paddingTop} onChange={val => setProp((props: any) => props.paddingTop = val)} isValid errorMessage='' />

        <TextInput id='padding-right' label='Padding Right' value={paddingRight} onChange={val => setProp((props: any) => props.paddingRight = val)} isValid errorMessage='' />

        <TextInput id='padding-bottom' label='Padding Bottom' value={paddingBottom} onChange={val => setProp((props: any) => props.paddingBottom = val)} isValid errorMessage='' />

        <TextInput id='padding-left' label='Padding Left' value={paddingLeft} onChange={val => setProp((props: any) => props.paddingLeft = val)} isValid errorMessage='' />
      </Accordion>
    </AccordionGroup>
  )
}