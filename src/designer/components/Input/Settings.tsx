import { useNode } from '@craftjs/core'
import { useEffect, useState } from 'react'
import { updateParams } from '@blueprints/utils'
import AccordionGroup from '@components/AccordionGroup'
import Accordion from '@components/Accordion'
import Select from '@components/inputs/Select'
import TextInput from '@components/inputs/TextInput'
import { openModal } from '@state/modals'
import { useLocalState } from '@designer/hooks/useLocalState'
import Button from '@components/inputs/Button'
import globalStyles from '@designer/styles'
import BlueprintEditor from '@modals/BlueprintEditor'

export function SelectSettings() {
  const { id, actions: { setProp },
    label,
    type,
    minNumber, maxNumber,

    getValue, onChange,

    marginTop, marginRight, marginBottom, marginLeft,
    width, maxWidth, minWidth
  } = useNode(node => ({
    label: node.data.props.label,

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

  const [openAccordion, setOpenAccordion] = useState(-1)

  const localParams = useLocalState(id)
  useEffect(() => {
    setProp((props: any) => {
      props.getValue = {
        edges: props.getValue.edges,
        nodes: updateParams(props.getValue.nodes, localParams, { name: 'value', type: (type === 'text') ? 'string' : 'number', isArray: false })
      }

      props.onChange = {
        edges: props.onChange.edges,
        nodes: updateParams(props.onChange.nodes, [ ...localParams, { name: 'field value', type: (type === 'text') ? 'string' : 'number', isArray: false } ])
      }
    })
  }, [localParams])

  return (
    <AccordionGroup>
      <Accordion id='label' title='Label' isOpen={openAccordion === 0} toggleState={shouldOpen => setOpenAccordion(shouldOpen ? 0 : -1)}>
        <TextInput id='label' label='Update Label' value={label} onChange={val => setProp((props: any) => props.label = val)} isValid errorMessage='' />
      </Accordion>
      <Accordion id='data' title='Data' isOpen={openAccordion === 1} toggleState={shouldOpen => setOpenAccordion(shouldOpen ? 1 : -1)}>

        <Select id='input-type' label='Type' value={type} onChange={t => {
          setProp((props: any) => {
            props.type = t

            props.getValue.nodes = updateParams(props.getValue.nodes, localParams, { name: 'value', type: (t === 'text') ? 'string' : 'number', isArray: false })
            props.onChange.nodes = updateParams(props.onChange.nodes, [ ...localParams, { name: 'field value', type: (t === 'text') ? 'string' : 'number', isArray: false } ])

            return props
          })
        }}>
          {['text', 'number'].map(type => (<option key={type} value={type}>{type}</option>))}
        </Select>

        {type === 'number' && (
          <>
            <TextInput id='min-number' label='Min Number' type='number' value={minNumber} onChange={val => setProp((props: any) => props.minNumber = val)} isValid errorMessage='' />
            <TextInput id='max-number' label='Max Number' type='number' value={maxNumber} onChange={val => setProp((props: any) => props.maxNumber = val)} isValid errorMessage='' />
          </>
        )}

        <Button color='light' onClick={() => 
          openModal('blueprint', ({ id }) => (
            <BlueprintEditor id={id} data={getValue} onSave={(bp) => {
              setProp((props: any) => props.getValue = bp)
            }} />
          ))}>
          Get Value Blueprint
        </Button>

        <Button color='light' onClick={() => 
          openModal('blueprint', ({ id }) => (
            <BlueprintEditor id={id} data={onChange} onSave={(bp) => {
              setProp((props: any) => props.onChange = bp)
            }} />
          ))}>
          onChange Blueprint
        </Button>
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

        <Select id='width' label='Width' value={width} onChange={w => setProp((props: any) => props.width = w)}>
          {Object.keys(globalStyles.size).map(style => (<option key={style} value={style}>{style}</option>))}
        </Select>

        <Select id='max-width' label='Max Width' value={maxWidth} onChange={mw => setProp((props: any) => props.maxWidth = mw)}>
          {Object.keys(globalStyles.size).map(style => (<option key={style} value={style}>{style}</option>))}
        </Select>

        <Select id='min-width' label='Min Width' value={minWidth} onChange={mw => setProp((props: any) => props.minWidth = mw)}>
          {Object.keys(globalStyles.size).map(style => (<option key={style} value={style}>{style}</option>))}
        </Select>
      </Accordion>
      
      {/* <Accordion id='styling' title='Styling' isOpen={openAccordion === 5} toggleState={shouldOpen => setOpenAccordion(shouldOpen ? 5 : -1)}>
        <Select id='container-background' label='Background' value={background} onChange={b => setProp((props: any) => props.background = b)}>
          {Object.keys(styles).map(style => (<option key={style} value={style}>{style}</option>))}
        </Select>
      </Accordion> */}
    </AccordionGroup>
  )
}
