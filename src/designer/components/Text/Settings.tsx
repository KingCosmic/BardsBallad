import { useEffect, useState } from 'react'
import { updateParams } from '@blueprints/utils'
import Accordion from '@components/Accordion'
import AccordionGroup from '@components/AccordionGroup'
import Button from '@components/inputs/Button'
import Checkbox from '@components/inputs/Checkbox'
import TextInput from '@components/inputs/TextInput'
import { openModal } from '@state/modals'
import { useNode } from '@craftjs/core'
import { useLocalState } from '@designer/hooks/useLocalState'
import Select from '@components/inputs/Select'
import styles from './styles'
import globalStyles from '@designer/styles'
import BlueprintEditor from '@modals/BlueprintEditor'

export default function TextSettings() {
  const { id, actions: { setProp },
    useBlueprintValue, blueprint,
    text, color,
    fontSize, fontWeight,
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

  const [openAccordion, setOpenAccordion] = useState(-1)

  const localParams = useLocalState(id)
  useEffect(() => {
    setProp((props: any) => {
      props.blueprint = {
        edges: props.blueprint.edges,
        nodes: updateParams(props.blueprint.nodes, localParams)
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
            <Button color='primary' onClick={() =>
              openModal('blueprint', ({ id }) => (
                <BlueprintEditor id={id} data={blueprint} onSave={(bp) => {
                  setProp((props: any) => props.blueprint = bp)
                }} />
              ))}>
              Edit Blueprint Value
            </Button>
          ) : (
            <TextInput id='text' label='Text' placeholder='lorem ipsum' value={text} onChange={val => setProp((props: any) => props.text = val)} isValid errorMessage='' />
          )
        }
      </Accordion>
      <Accordion id='content-styling' title='Content Styling' isOpen={openAccordion === 1} toggleState={shouldOpen => setOpenAccordion(shouldOpen ? 1 : -1)}>
        <Select id='color' label='Color' value={color} onChange={c => setProp((props: any) => props.color = c)}>
          {Object.keys(styles.colors).map(style => (<option key={style} value={style}>{style}</option>))}
        </Select>

        <Select id='font-size' label='Font Size' value={fontSize} onChange={fs => setProp((props: any) => props.fontSize = fs)}>
          {Object.keys(styles.sizes).map(style => (<option key={style} value={style}>{style}</option>))}
        </Select>

        <Select id='font-weight' label='Font Weight' value={fontWeight} onChange={fw => setProp((props: any) => props.fontWeight = fw)}>
          {Object.keys(styles.weight).map(style => (<option key={style} value={style}>{style}</option>))}
        </Select>

        <Select id='text-align' label='Text Align' value={textAlign} onChange={tl => setProp((props: any) => props.textAlign = tl)}>
          <option value='left'>Left</option>
          <option value='center'>Center</option>
          <option value='right'>Right</option>
        </Select>

        <Select id='text-decoration' label='Text Decoration' value={textDecoration} onChange={td => setProp((props: any) => props.textDecoration = td)}>
          <option value='none'>None</option>
          <option value='underline'>Underline</option>
          <option value='line-through'>Line-Through</option>
        </Select>

        <Select id='text-transform' label='Text Transform' value={textTransform} onChange={tf => setProp((props: any) => props.textTransform = tf)}>
          <option value='none'>None</option>
          <option value='uppercase'>Uppercase</option>
          <option value='lowercase'>Lowercase</option>
        </Select>
      </Accordion>

      <Accordion id='spacing' title='Spacing' isOpen={openAccordion === 2} toggleState={shouldOpen => setOpenAccordion(shouldOpen ? 2 : -1)}>
      <Select id='margin-top' label='Margin Top' value={marginTop} onChange={mt => setProp((props: any) => props.marginTop = mt)}>
          {Object.keys(globalStyles.spacing).map(style => (<option key={style} value={style}>{style}</option>))}
        </Select>

        <Select id='margin-right' label='Margin Right' value={marginRight} onChange={mr => setProp((props: any) => props.marginRight = mr)}>
          {Object.keys(globalStyles.spacing).map(style => (<option key={style} value={style}>{style}</option>))}
        </Select>

        <Select id='margin-bottom' label='Margin Bottom' value={marginBottom} onChange={mb => setProp((props: any) => props.marginBottom = mb)}>
          {Object.keys(globalStyles.spacing).map(style => (<option key={style} value={style}>{style}</option>))}
        </Select>

        <Select id='margin-left' label='Margin Left' value={marginLeft} onChange={ml => setProp((props: any) => props.marginTop = ml)}>
          {Object.keys(globalStyles.spacing).map(style => (<option key={style} value={style}>{style}</option>))}
        </Select>

        <Select id='padding-top' label='Padding Top' value={paddingTop} onChange={pt => setProp((props: any) => props.paddingTop = pt)}>
          {Object.keys(globalStyles.spacing).map(style => (<option key={style} value={style}>{style}</option>))}
        </Select>

        <Select id='padding-right' label='Padding Right' value={paddingRight} onChange={pr => setProp((props: any) => props.paddingRight = pr)}>
          {Object.keys(globalStyles.spacing).map(style => (<option key={style} value={style}>{style}</option>))}
        </Select>

        <Select id='padding-bottom' label='Padding Bottom' value={paddingBottom} onChange={pb => setProp((props: any) => props.paddingBottom = pb)}>
          {Object.keys(globalStyles.spacing).map(style => (<option key={style} value={style}>{style}</option>))}
        </Select>

        <Select id='padding-left' label='Padding Left' value={paddingLeft} onChange={pl => setProp((props: any) => props.paddingLeft = pl)}>
          {Object.keys(globalStyles.spacing).map(style => (<option key={style} value={style}>{style}</option>))}
        </Select>
      </Accordion>
    </AccordionGroup>
  )
}
