import { useEditor, useNode } from '@craftjs/core'
import { useEffect, useState } from 'react'
import { updateParams } from '@blueprints/utils'
import AccordionGroup from '@components/AccordionGroup'
import Accordion from '@components/Accordion'
import Checkbox from '@components/inputs/Checkbox'
import Select from '@components/inputs/Select'
import TextInput from '@components/inputs/TextInput'
import { openModal } from '@state/modals'
import { useLocalState } from '@designer/hooks/useLocalState'
import Button from '@components/inputs/Button'
import globalStyles from '@designer/styles'
import BlueprintEditor from '@modals/BlueprintEditor'
import { getReturnTypeOfBlueprint } from '@utils/Blueprints/getReturnTypeOfBlueprint'

export function SelectSettings() {
  const { id, actions: { setProp },
    label,
    dynamicOptions, optionsBlueprint, onChange,

    marginTop, marginRight, marginBottom, marginLeft,
    width, maxWidth, minWidth
  } = useNode(node => ({
    label: node.data.props.label,

    dynamicOptions: node.data.props.dynamicOptions,
    optionsBlueprint: node.data.props.optionsBlueprint,
    options: node.data.props.options,
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
      props.optionsBlueprint = {
        edges: props.optionsBlueprint.edges,
        nodes: updateParams(props.optionsBlueprint.nodes, localParams)
      }

      props.onChange = {
        edges: props.onChange.edges,
        nodes: updateParams(props.onChange.nodes, localParams)
      }

      return props
    })
  }, [localParams])

  return (
    <AccordionGroup>
      <Accordion id='label' title='Label' isOpen={openAccordion === 0} toggleState={shouldOpen => setOpenAccordion(shouldOpen ? 0 : -1)}>
        <TextInput id='label' label='Update Label' value={label} onChange={val => setProp((props: any) => props.label = val)} isValid errorMessage='' />
      </Accordion>
      <Accordion id='options' title='Options' isOpen={openAccordion === 1} toggleState={shouldOpen => setOpenAccordion(shouldOpen ? 1 : -1)}>
        <Checkbox id='dynamic-options' label='Dynamic Options?' checked={dynamicOptions} onChange={bool => setProp((props: any) => props.dynamicOptions = bool)} />

        {
          dynamicOptions ? (
            <Button color='light' onClick={() =>
              openModal('blueprint', ({ id }) => (
                <BlueprintEditor id={id} data={optionsBlueprint} onSave={(bp) => {
                  setProp((props: any) => {
                  props.optionsBlueprint = bp

                  props.onChange = {
                    edges: props.onChange.edges,
                    nodes: updateParams(props.onChange.nodes, [ ...localParams, {
                      name: 'selectedValue',
                      type: getReturnTypeOfBlueprint(bp),
                      isArray: false
                    } ])
                  }

                  return props
                })
                }} />
              ))}>
              Options Blueprint
            </Button>
          ) : (
            <p>TODO: handle options.</p>
          )
        }

        <div className='h-2' />

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
