import { useNode } from '@craftjs/core'
import { useEffect, useState } from 'react'
import { updateParams } from '@blueprints/utils'
import AccordionGroup from '@components/AccordionGroup'
import Accordion from '@components/Accordion'
import Checkbox from '@components/inputs/Checkbox'
import Select from '@components/inputs/Select'
import TextInput from '@components/inputs/TextInput'
import { openModal } from '@state/modals'
import { getReturnTypeOfBlueprint } from '@utils/Blueprints/getReturnTypeOfBlueprint'
import { useLocalState } from '@designer/hooks/useLocalState'
import styles from './styles'
import Button from '@components/inputs/Button'
import globalStyles from '@designer/styles'
import BlueprintEditor from '@modals/BlueprintEditor'

export function ContainerSettings() {
  const { id, actions: { setProp },
    showPlaceholder,
    isVisible, dynamicVisibility, visibilityBlueprint,
    isList, dataName, blueprint,
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
    visibilityBlueprint: node.data.props.visibilityBlueprint,

    isList: node.data.props.isList,
    dataName: node.data.props.dataName,
    blueprint: node.data.props.blueprint,
    
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

  const [openAccordion, setOpenAccordion] = useState(-1)

  const localParams = useLocalState(id)
  useEffect(() => {
    setProp((props: any) => {
      props.blueprint = {
        edges: props.blueprint.edges,
        nodes: updateParams(props.blueprint.nodes, localParams)
      }

      props.visibilityBlueprint = { 
        edges: props.visibilityBlueprint.edges,
        nodes: updateParams(props.visibilityBlueprint.nodes, localParams)
      }
      
      props.onPress = {
        edges: props.onPress.edges,
        nodes: updateParams(props.onPress.nodes, localParams)
      }
    
      return props
    })
  }, [localParams])

  return (
    <AccordionGroup>
      <Checkbox id='show-placeholder' label='Visible?' checked={showPlaceholder} onChange={val => setProp((props: any) => props.showPlaceholder = val)} />

      <Accordion id='visibility' title='Visibility' isOpen={openAccordion === 0} toggleState={shouldOpen => setOpenAccordion(shouldOpen ? 0 : -1)}>
        <Checkbox id='dynamic-visiblity' label='Dynamic Visibility?' checked={dynamicVisibility} onChange={val => setProp((props: any) => props.dynamicVisibility = val)} />

        {
          dynamicVisibility ? (
            <p onClick={() => 
              openModal('blueprint', ({ id }) => (
                <BlueprintEditor id={id} data={visibilityBlueprint} onSave={(bp) => setProp((props: any) => props.visibilityBlueprint = bp)} />
              ))}>
              Visibility Blueprint
            </p>
          ) : (
            <Checkbox id='is-visible' label='Visible?' checked={isVisible} onChange={val => setProp((props: any) => props.isVisible = val)} />
          )
        }
      </Accordion>
      <Accordion id='list' title='List' isOpen={openAccordion === 1} toggleState={shouldOpen => setOpenAccordion(shouldOpen ? 1 : -1)}>
        <Checkbox id='is-list' label='Is Dynamic List' checked={isList} onChange={val => {
          setProp((props: any) => {
            props.isList = val

            props.local = val ? [
              {
                name: dataName,
                type: getReturnTypeOfBlueprint(blueprint),
                isArray: false
              }
            ] : []

            return props
          })
        }} />

        <TextInput id='variable-name' label='Variable Name' isValid errorMessage='' value={dataName} onChange={val => {
          setProp((props: any) => {
            props.dataName = val

            const index = props.local.findIndex((localProp: any) => localProp.name === dataName)

            if (index === -1) return

            props.local[index].name = val

            return props
          })
        }} />

        <Button color='light' onClick={() => 
          openModal('blueprint', ({ id }) => (
            <BlueprintEditor id={id} data={blueprint} onSave={(bp) => {
              setProp((props: any) => {
                props.blueprint = bp
    
                const index = props.local.findIndex((localProp: any) => localProp.name === dataName)
    
                if (index === -1) return
    
                props.local[index].type = getReturnTypeOfBlueprint(bp)
    
                return props
              })
            }} />
          ))}>
          List Data Blueprint
        </Button>
      </Accordion>
      <Accordion id='input' title='Input' isOpen={openAccordion === 2} toggleState={shouldOpen => setOpenAccordion(shouldOpen ? 2 : -1)}>
        <Checkbox id='is-interactive' label='Is Interactive?' checked={isInteractive} onChange={interactive => setProp((props: any) => props.isInteractive = interactive)} />

        <Button color='light' onClick={() => 
          openModal('blueprint', ({ id }) => (
            <BlueprintEditor id={id} data={blueprint} onSave={(bp) => {
              setProp((props: any) => props.onPress = bp)
            }} />
          ))}>
          On Press Blueprint
        </Button>
      </Accordion>

      <Accordion id='layout' title='Layout' isOpen={openAccordion === 3} toggleState={shouldOpen => setOpenAccordion(shouldOpen ? 3 : -1)}>
        <Select id='display' label='Display' value={display} onChange={val => setProp((props: any) => props.display = val)}>
          <option value='block'>Block</option>
          <option value='flex'>Flex</option>
          <option value='grid'>Grid</option>
        </Select>

        <Select id='position' label='Position' value={position} onChange={val => setProp((props: any) => props.position = val)}>
          <option value='static'>Static</option>
          <option value='relative'>Relative</option>
          <option value='absolute'>Absolute</option>
          <option value='fixed'>Fixed</option>
          <option value='sticky'>Sticky</option>
        </Select>

        {
          (position !== 'static') ? (
            <>
              <TextInput id='top' label='Top' isValid errorMessage='' value={top} onChange={val => setProp((props: any) => props.top = val)} />
              
              <TextInput id='right' label='Right' isValid errorMessage='' value={right} onChange={val => setProp((props: any) => props.right = val)} />

              <TextInput id='bottom' label='Bottom' isValid errorMessage='' value={bottom} onChange={val => setProp((props: any) => props.bottom = val)} />

              <TextInput id='left' label='Left' isValid errorMessage='' value={left} onChange={val => setProp((props: any) => props.left = val)} />
            </>
          ) : null
        }

        {
          display === 'grid' ? (
            <>
              <TextInput id='columns' label='Columns' isValid errorMessage='' value={columns} onChange={val => setProp((props: any) => props.columns = val)} />
              
              <TextInput id='rows' label='Rows' isValid errorMessage='' value={rows} onChange={val => setProp((props: any) => props.rows = val)} />
            </>
          ) : null
        }

        {
          ['flex', 'grid'].includes(display) ? (
            <>
              <Select id='flex-direction' label='Flex Direction' value={flexDirection} onChange={val => setProp((props: any) => props.flexDirection = val)}>
                <option value='row'>Row</option>
                <option value='column'>Column</option>
                <option value='row-reverse'>Reverse Row</option>
                <option value='column-reverse'>Reverse Column</option>
              </Select>

              <Select id='align-items' label='Align Items' value={alignItems} onChange={val => setProp((props: any) => props.alignItems = val)}>
                <option value='initial'>Initial</option>
                <option value='inherit'>Inherit</option>
                <option value='normal'>Normal</option>
                <option value='stretch'>Stretch</option>
                <option value='center'>Center</option>
                <option value='flex-start'>Flex-Start</option>
                <option value='flex-end'>Flex-End</option>
                <option value='start'>Start</option>
                <option value='end'>End</option>
                <option value='baseline'>Baseline</option>
              </Select>

              <Select id='justify-content' label='Justify Content' value={justifyContent} onChange={val => setProp((props: any) => props.justifyContent = val)}>
                <option value='initial'>Initial</option>
                <option value='inherit'>Inherit</option>
                <option value='stretch'>Stretch</option>
                <option value='center'>Center</option>
                <option value='flex-start'>Flex-Start</option>
                <option value='flex-end'>Flex-End</option>
                <option value='space-between'>Space-Between</option>
                <option value='space-around'>Space-Around</option>
                <option value='space-evenly'>Space-Evenly</option>
              </Select>

              <Select id='container-gap' label='Gap' value={gap} onChange={gap => setProp((props: any) => props.gap = gap)}>
                {Object.keys(globalStyles.spacing).map(style => (<option key={style} value={style}>{style}</option>))}
              </Select>
            </>
          ) : null
        }
      </Accordion>

      <Accordion id='spacing' title='Spacing' isOpen={openAccordion === 4} toggleState={shouldOpen => setOpenAccordion(shouldOpen ? 4 : -1)}>
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

        <Select id='width' label='Width' value={width} onChange={w => setProp((props: any) => props.width = w)}>
          {Object.keys(globalStyles.size).map(style => (<option key={style} value={style}>{style}</option>))}
        </Select>

        <Select id='height' label='Height' value={height} onChange={h => setProp((props: any) => props.height = h)}>
          {Object.keys(globalStyles.size).map(style => (<option key={style} value={style}>{style}</option>))}
        </Select>

        <Select id='max-width' label='Max Width' value={maxWidth} onChange={mw => setProp((props: any) => props.maxWidth = mw)}>
          {Object.keys(globalStyles.size).map(style => (<option key={style} value={style}>{style}</option>))}
        </Select>

        <Select id='max-height' label='Max Height' value={maxHeight} onChange={mh => setProp((props: any) => props.maxHeight = mh)}>
          {Object.keys(globalStyles.size).map(style => (<option key={style} value={style}>{style}</option>))}
        </Select>

        <Select id='min-width' label='Min Width' value={minWidth} onChange={mw => setProp((props: any) => props.minWidth = mw)}>
          {Object.keys(globalStyles.size).map(style => (<option key={style} value={style}>{style}</option>))}
        </Select>

        <Select id='min-height' label='Min Height' value={minHeight} onChange={mh => setProp((props: any) => props.minHeight = mh)}>
          {Object.keys(globalStyles.size).map(style => (<option key={style} value={style}>{style}</option>))}
        </Select>
      </Accordion>
      
      <Accordion id='styling' title='Styling' isOpen={openAccordion === 5} toggleState={shouldOpen => setOpenAccordion(shouldOpen ? 5 : -1)}>
        <Select id='container-background' label='Background' value={background} onChange={b => setProp((props: any) => props.background = b)}>
          {Object.keys(styles).map(style => (<option key={style} value={style}>{style}</option>))}
        </Select>

        <Select id='container-border' label='Border' value={border} onChange={b => setProp((props: any) => props.border = b)}>
          {Object.keys(styles).map(style => (<option key={style} value={style}>{style}</option>))}
        </Select>

        <Select id='container-hover' label='Hover' value={hover} onChange={b => setProp((props: any) => props.hover = b)}>
          {Object.keys(styles).map(style => (<option key={style} value={style}>{style}</option>))}
        </Select>
      </Accordion>
    </AccordionGroup>
  )
}
