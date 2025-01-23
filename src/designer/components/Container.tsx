import { NodeHelpersType, Node, useNode, UserComponentConfig } from '@craftjs/core'
import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react'
import { openModal } from '../../state/modals'
import { getReturnTypeOfBlueprint } from '../../utils/Blueprints/getReturnTypeOfBlueprint'
import { BlueprintData } from '../../state/systems'
import { getDefaultNodes, updateParams } from '../../blueprints/utils';
import { useLocalState } from '../hooks/useLocalState'
import BlueprintProcessor from '../../utils/Blueprints/processBlueprint'
import { AddData, useLocalData } from '../renderer/Context'
import { characterState } from '../../state/character'
import AccordionGroup from '../../components/AccordionGroup'
import Accordion from '../../components/Accordion'
import Checkbox from '../../components/inputs/Checkbox'
import TextInput from '../../components/inputs/TextInput'
import Select from '../../components/inputs/Select'

type ContainerProps = {
  showPlaceholder?: boolean;
  dynamicVisibility?: boolean;
  visibilityBlueprint?: BlueprintData;
  isVisible?: boolean;
  isList?: boolean;
  dataName?: string;
  blueprint?: BlueprintData;
  onPress?: BlueprintData;
  background?: string;
  display?: string;
  position?: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  flexDirection?: string;
  alignItems?: string;
  justifyContent?: string;
  gap?: string;
  rows?: number;
  columns?: number;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  height?: string;
  width?: string;
  maxHeight?: string;
  maxWidth?: string;
  minHeight?: string;
  minWidth?: string;

  local?: any;
}

function Container(props: PropsWithChildren<ContainerProps>) {
  const { connectors: { connect, drag } } = useNode()

  return (
    <div ref={ref => connect(drag(ref!))}
      // @ts-ignore
      style={{ ...props }}
    >
      {
        props.children ? props.children : (props.showPlaceholder) ? (
          <div>
            Add An Item!
          </div>
        ) : null
      }
    </div>
  )
}

export function ContainerPreview(props: PropsWithChildren<ContainerProps>) {
  const localData = useLocalData()

  const character = characterState.useValue()

  const items = useMemo(() => {
    const processor = new BlueprintProcessor(props.blueprint!)

    const output = processor.processBlueprint(localData) || []

    return output
  }, [localData, character])

  const isVisible = useMemo(() => {
    if (!props.dynamicVisibility) return props.isVisible

    const processor = new BlueprintProcessor(props.visibilityBlueprint!)

    const isVisible = processor.processBlueprint(localData) || false

    return isVisible
  }, [localData, character])

  const onClick = useCallback(() => {
    const processor = new BlueprintProcessor(props.onPress!)

    processor.processBlueprint(localData)
  }, [props.onPress, localData])

  return (
    <div
      // @ts-ignore
      style={{ ...props, display: isVisible ? props.display : 'none' }}
      onClick={onClick}
    >
      {
        props.isList ? (
          items.map((item: any) => (
            <AddData key={item.name} localData={{ [props.dataName!]: item }}>
              {/* @ts-ignore */}
              {props.children}
            </AddData>
          ))
        ) : props.children
      }
    </div>
  )
}

function ContainerSettings() {
  const { id, actions: { setProp },
    showPlaceholder,
    isVisible, dynamicVisibility, visibilityBlueprint,
    isList, dataName, blueprint,
    onPress,
    display, position, top, right, bottom, left,
    flexDirection, alignItems, justifyContent, gap,
    rows, columns,
    marginTop, marginRight, marginBottom, marginLeft,
    paddingTop, paddingRight, paddingBottom, paddingLeft,
    height, width, maxHeight, maxWidth, minHeight, minWidth,
    background
  } = useNode(node => ({
    showPlaceholder: node.data.props.showPlaceholder,
    isVisible: node.data.props.isVisible,
    dynamicVisibility: node.data.props.dynamicVisibility,
    visibilityBlueprint: node.data.props.visibilityBlueprint,
    isList: node.data.props.isList,
    dataName: node.data.props.dataName,
    blueprint: node.data.props.blueprint,
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
    background: node.data.props.background
  }))

  const localParams = useLocalState(id)
  const [openAccordion, setOpenAccordion] = useState(-1)

  useEffect(() => {
    setProp((props: any) => {
      props.blueprint.nodes = updateParams(props.blueprint.nodes, localParams)
      props.visibilityBlueprint.nodes = updateParams(props.visibilityBlueprint.nodes, localParams)
      props.onPress.nodes = updateParams(props.onPress.nodes, localParams)
    
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
            <p onClick={() => openModal({
              type: 'blueprint',
              title: '',
              data: visibilityBlueprint,
              onSave: (blueprint) => {
                setProp((props: any) => props.visibilityBlueprint = blueprint)
              }
            })}>
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

        <p onClick={() => openModal({
          type: 'blueprint',
          title: '',
          data: blueprint,
          onSave: (blueprint) => {
            setProp((props: any) => {
              props.blueprint = blueprint
  
              const index = props.local.findIndex((localProp: any) => localProp.name === dataName)
  
              if (index === -1) return
  
              props.local[index].type = getReturnTypeOfBlueprint(blueprint)
  
              return props
            })
          }
        })}>
          List Data Blueprint
        </p>
      </Accordion>
      <Accordion id='input' title='Input' isOpen={openAccordion === 2} toggleState={shouldOpen => setOpenAccordion(shouldOpen ? 2 : -1)}>
        <p onClick={() => openModal({
          type: 'blueprint',
          title: '',
          data: onPress,
          onSave: (blueprint) => {
            setProp((props: any) => props.onPress = blueprint)
          }
        })}>
          On Press Blueprint
        </p>
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

              <TextInput id='gap' label='Gap' isValid errorMessage='' value={gap} onChange={val => setProp((props: any) => props.gap = val)} />
            </>
          ) : null
        }
      </Accordion>

      <Accordion id='spacing' title='Spacing' isOpen={openAccordion === 4} toggleState={shouldOpen => setOpenAccordion(shouldOpen ? 4 : -1)}>
        <TextInput id='margin-top' label='Margin Top' value={marginTop} onChange={val => setProp((props: any) => props.marginTop = val)} isValid errorMessage='' />

        <TextInput id='margin-right' label='Margin Right' value={marginRight} onChange={val => setProp((props: any) => props.marginRight = val)} isValid errorMessage='' />
          
        <TextInput id='margin-bottom' label='Margin Bottom' value={marginBottom} onChange={val => setProp((props: any) => props.marginBottom = val)} isValid errorMessage='' />

        <TextInput id='margin-left' label='Margin Left' value={marginLeft} onChange={val => setProp((props: any) => props.marginLeft = val)} isValid errorMessage='' />

        <TextInput id='padding-top' label='Padding Top' value={paddingTop} onChange={val => setProp((props: any) => props.paddingTop = val)} isValid errorMessage='' />

        <TextInput id='padding-right' label='Padding Right' value={paddingRight} onChange={val => setProp((props: any) => props.paddingRight = val)} isValid errorMessage='' />

        <TextInput id='padding-bottom' label='Padding Bottom' value={paddingBottom} onChange={val => setProp((props: any) => props.paddingBottom = val)} isValid errorMessage='' />

        <TextInput id='padding-left' label='Padding Left' value={paddingLeft} onChange={val => setProp((props: any) => props.paddingLeft = val)} isValid errorMessage='' />

        <TextInput id='width' label='Width' value={width} onChange={val => setProp((props: any) => props.width = val)} isValid errorMessage='' />

        <TextInput id='height' label='Height' value={height} onChange={val => setProp((props: any) => props.height = val)} isValid errorMessage='' />

        <TextInput id='max-width' label='Max Width' value={maxWidth} onChange={val => setProp((props: any) => props.maxWidth = val)} isValid errorMessage='' />

        <TextInput id='max-height' label='Max Height' value={maxHeight} onChange={val => setProp((props: any) => props.maxHeight = val)} isValid errorMessage='' />

        <TextInput id='min-width' label='Min Width' value={minWidth} onChange={val => setProp((props: any) => props.minWidth = val)} isValid errorMessage='' />

        <TextInput id='min-height' label='Min Height' value={minHeight} onChange={val => setProp((props: any) => props.minHeight = val)} isValid errorMessage='' />
      </Accordion>
      
      <Accordion id='border' title='Border' isOpen={openAccordion === 5} toggleState={shouldOpen => setOpenAccordion(shouldOpen ? 5 : -1)}>
        TODO:(Cosmic) gotta do this soon
      </Accordion>

      <Accordion id='background' title='Background' isOpen={openAccordion === 6} toggleState={shouldOpen => setOpenAccordion(shouldOpen ? 6 : -1)}>
        <TextInput id='background' label='Background' value={background} onChange={val => setProp((props: any) => props.background = val)} isValid errorMessage='' />
      </Accordion>
    </AccordionGroup>
  )
}

const CraftSettings: Partial<UserComponentConfig<PropsWithChildren<ContainerProps>>> = {
  defaultProps: {
    showPlaceholder: true,
    dynamicVisibility: false,
    visibilityBlueprint: {
      nodes: getDefaultNodes(
        [],
        {
          name: 'isVisible',
          type: 'boolean',
          isArray: false
        }
      ),
      edges: []
    },
    isVisible: true,
    isList: false,
    dataName: 'listItem',
    blueprint: {
      nodes: getDefaultNodes(
        [],
        {
          name: 'listItem',
          type: 'any',
          isArray: true
        }
      ),
      edges: []
    },

    local: [],

    onPress: {
      nodes: getDefaultNodes([]),
      edges: [],
    },

    display: 'flex',
    position: 'static',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
    flexDirection: 'column',
    alignItems: 'normal',
    justifyContent: 'initial',
    gap: '0px',
    rows: 0,
    columns: 0,

    marginTop: '0px',
    marginRight: '0px',
    marginBottom: '0px',
    marginLeft: '0px',
    paddingTop: '5px',
    paddingRight: '5px',
    paddingBottom: '5px',
    paddingLeft: '5px',
    height: 'auto',
    width: 'auto',
    maxHeight: 'none',
    maxWidth: 'none',
    minHeight: 'none',
    minWidth: 'none',

    background: 'none',
  },
  rules: {
    canMoveIn: (incoming: Node[], current: Node, helpers: NodeHelpersType) => {
      return (current.data.props.isList) ? (current.data.nodes.length === 0) : true
    }
  },
  related: {
    settings: ContainerSettings
  }
}

Container.craft = CraftSettings

export default Container