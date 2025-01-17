import { IonAccordion, IonAccordionGroup, IonCheckbox, IonInput, IonItem, IonLabel, IonList, IonSelect, IonSelectOption } from '@ionic/react'

import { NodeHelpersType, Node, useNode, UserComponentConfig } from '@craftjs/core'
import { PropsWithChildren, useCallback, useEffect, useMemo } from 'react'
import { openModal } from '../../state/modals'
import { getReturnTypeOfBlueprint } from '../../utils/Blueprints/getReturnTypeOfBlueprint'
import { BlueprintData } from '../../state/systems'
import { getDefaultNodes, updateParams } from '../../blueprints/utils';
import { useLocalState } from '../hooks/useLocalState'
import BlueprintProcessor from '../../utils/Blueprints/processBlueprint'
import { AddData, useLocalData } from '../renderer/Context'
import { characterState } from '../../state/character'

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

  useEffect(() => {
    setProp((props: any) => {
      props.blueprint.nodes = updateParams(props.blueprint.nodes, localParams)
      props.visibilityBlueprint.nodes = updateParams(props.visibilityBlueprint.nodes, localParams)
      props.onPress.nodes = updateParams(props.onPress.nodes, localParams)
    
      return props
    })
  }, [localParams])

  return (
    <IonAccordionGroup>
      <IonItem>
        <IonCheckbox checked={showPlaceholder} onIonChange={() => {
          setProp((props: any) => props.showPlaceholder = !showPlaceholder)
        }}>Show Placeholder</IonCheckbox>
      </IonItem>
      <IonAccordion value='visibility'>
        <IonItem slot='header' color='light'>
          <IonLabel>Visibility</IonLabel>
        </IonItem>
        <div className='ion-padding' slot='content'>
          <IonList>
            <IonItem>
              <IonCheckbox checked={dynamicVisibility} onIonChange={() => {
                setProp((props: any) => props.dynamicVisibility = !dynamicVisibility)
              }}>Dynamic Visibility?</IonCheckbox>
            </IonItem>

            {
              dynamicVisibility ? (
                <IonItem button={true} onClick={() => openModal({
                  type: 'blueprint',
                  title: '',
                  data: visibilityBlueprint,
                  onSave: (blueprint) => {
                    setProp((props: any) => props.visibilityBlueprint = blueprint)
                  }
                })}>
                  Visibility Blueprint
                </IonItem>
              ) : (
                <IonItem>
                  <IonCheckbox checked={isVisible} onIonChange={() => {
                    setProp((props: any) => props.isVisible = !isVisible)
                  }}>Visible?</IonCheckbox>
                </IonItem>
              )
            }
          </IonList>
        </div>
      </IonAccordion>
      <IonAccordion value='list'>
        <IonItem slot='header' color='light'>
          <IonLabel>List</IonLabel>
        </IonItem>
        <div className='ion-padding' slot='content'>
          <IonList>
            <IonItem>
              <IonCheckbox checked={isList} onIonChange={() => {
                setProp((props: any) => {
                  const newValue = !isList

                  props.isList = newValue

                  if (!newValue) {
                    props.local = []
                  } else if (newValue) {
                    props.local = [
                      {
                        name: dataName,
                        type: getReturnTypeOfBlueprint(blueprint),
                        isArray: false
                      }
                    ]
                  }

                  return props
                })
              }}>Is Dynamic List?</IonCheckbox>
            </IonItem>

            <IonItem>
              <IonInput label='variable name' labelPlacement='stacked' fill='outline' placeholder='listItem' value={dataName} onIonChange={(ev: Event) => {
                const val = (ev.target as HTMLIonInputElement).value as string
                setProp((props: any) => {
                  props.dataName = val

                  const index = props.local.findIndex((localProp: any) => localProp.name === dataName)

                  if (index === -1) return

                  props.local[index].name = val

                  return props
                })
              }} />
            </IonItem>

            <IonItem button={true} onClick={() => openModal({
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
            </IonItem>
          </IonList>
        </div>
      </IonAccordion>
      <IonAccordion value='input'>
        <IonItem slot='header' color='light'>
          <IonLabel>Input</IonLabel>
        </IonItem>
        <div className='ion-padding' slot='content'>
          <IonList>
            <IonItem button={true} onClick={() => openModal({
              type: 'blueprint',
              title: '',
              data: onPress,
              onSave: (blueprint) => {
                setProp((props: any) => props.onPress = blueprint)
              }
            })}>
              On Press Blueprint
            </IonItem>
          </IonList>
        </div>
      </IonAccordion>
      <IonAccordion value='layout'>
        <IonItem slot='header' color='light'>
          <IonLabel>Layout</IonLabel>
        </IonItem>
        <div className='ion-padding' slot='content'>
          <IonList>
            <IonItem>
              <IonSelect label='Display' labelPlacement='floating' placeholder='Select Display'
                value={display}
                onIonChange={(e) => setProp((props: any) => props.display = e.detail.value)}
              >
                <IonSelectOption value='block'>Block</IonSelectOption>
                <IonSelectOption value='flex'>Flex</IonSelectOption>
                <IonSelectOption value='grid'>Grid</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonSelect label='Position' labelPlacement='floating' placeholder='Select Position'
                value={position}
                onIonChange={(e) => setProp((props: any) => props.position = e.detail.value)}
              >
                <IonSelectOption value='static'>Static</IonSelectOption>
                <IonSelectOption value='relative'>Relative</IonSelectOption>
                <IonSelectOption value='absolute'>Absolute</IonSelectOption>
                <IonSelectOption value='fixed'>Fixed</IonSelectOption>
                <IonSelectOption value='sticky'>Sticky</IonSelectOption>
              </IonSelect>
            </IonItem>

            {
              (position !== 'static') ? (
                <>
                  <IonItem>
                    <IonInput type='text' label='Top' value={top} onIonInput={(ev) => setProp((props: any) => props.top = (ev.target as unknown as HTMLInputElement).value)} />
                  </IonItem>

                  <IonItem>
                    <IonInput type='text' label='Right' value={right} onIonInput={(ev) => setProp((props: any) => props.right = (ev.target as unknown as HTMLInputElement).value)} />
                  </IonItem>

                  <IonItem>
                    <IonInput type='text' label='Bottom' value={bottom} onIonInput={(ev) => setProp((props: any) => props.bottom = (ev.target as unknown as HTMLInputElement).value)} />
                  </IonItem>

                  <IonItem>
                    <IonInput type='text' label='Left' value={left} onIonInput={(ev) => setProp((props: any) => props.left = (ev.target as unknown as HTMLInputElement).value)} />
                  </IonItem>
                </>
              ) : null
            }

            {
              display === 'grid' ? (
                <>
                  <IonItem>
                    <IonInput type='number' label='Colums' value={columns} onIonInput={(ev) => setProp((props: any) => props.gridColumns = +(ev.target as unknown as HTMLInputElement).value)} />
                  </IonItem>

                  <IonItem>
                    <IonInput type='number' label='Rows' value={rows} onIonInput={(ev) => setProp((props: any) => props.gridRows = +(ev.target as unknown as HTMLInputElement).value)} />
                  </IonItem>
                </>
              ) : null
            }

            {
              ['flex', 'grid'].includes(display) ? (
                <>
                  <IonItem>
                    <IonSelect label='Flex Direction' labelPlacement='floating' placeholder='Select Direction'
                      value={flexDirection}
                      onIonChange={(e) => setProp((props: any) => props.flexDirection = e.detail.value)}
                    >
                      <IonSelectOption value='row'>Row</IonSelectOption>
                      <IonSelectOption value='column'>Column</IonSelectOption>
                      <IonSelectOption value='row-reverse'>Reverse Row</IonSelectOption>
                      <IonSelectOption value='column-reverse'>Reverse Column</IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  <IonItem>
                    <IonSelect label='Align Items' labelPlacement='floating' placeholder='Select Alignment'
                      value={alignItems}
                      onIonChange={(e) => setProp((props: any) => props.alignItems = e.detail.value)}
                    >
                      <IonSelectOption value='initial'>Initial</IonSelectOption>
                      <IonSelectOption value='inherit'>Inherit</IonSelectOption>
                      <IonSelectOption value='normal'>Normal</IonSelectOption>
                      <IonSelectOption value='stretch'>Stretch</IonSelectOption>
                      <IonSelectOption value='center'>Center</IonSelectOption>
                      <IonSelectOption value='flex-start'>Flex-Start</IonSelectOption>
                      <IonSelectOption value='flex-end'>Flex-End</IonSelectOption>
                      <IonSelectOption value='start'>Start</IonSelectOption>
                      <IonSelectOption value='end'>End</IonSelectOption>
                      <IonSelectOption value='baseline'>Baseline</IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  <IonItem>
                    <IonSelect label='Justify Content' labelPlacement='floating' placeholder='Select Alignment'
                      value={justifyContent}
                      onIonChange={(e) => setProp((props: any) => props.justifyContent = e.detail.value)}
                    >
                      <IonSelectOption value='initial'>Initial</IonSelectOption>
                      <IonSelectOption value='inherit'>Inherit</IonSelectOption>
                      <IonSelectOption value='stretch'>Stretch</IonSelectOption>
                      <IonSelectOption value='center'>Center</IonSelectOption>
                      <IonSelectOption value='flex-start'>Flex-Start</IonSelectOption>
                      <IonSelectOption value='flex-end'>Flex-End</IonSelectOption>
                      <IonSelectOption value='space-between'>Space-Between</IonSelectOption>
                      <IonSelectOption value='space-around'>Space-Around</IonSelectOption>
                      <IonSelectOption value='space-evenly'>Space-Evenly</IonSelectOption>
                    </IonSelect>
                  </IonItem>

                  <IonItem>
                    <IonInput type='text' label='Gap' value={gap} onIonInput={(ev) => setProp((props: any) => props.gap = (ev.target as unknown as HTMLInputElement).value)} />
                  </IonItem>
                </>
              ) : null
            }
          </IonList>
        </div>
      </IonAccordion>
      <IonAccordion value='spacing'>
        <IonItem slot='header' color='light'>
          <IonLabel>Spacing</IonLabel>
        </IonItem>
        <div className='ion-padding' slot='content'>
          <IonList>
            <IonItem>
              <IonInput type='text' label='Margin Top' value={marginTop} onIonInput={(ev) => setProp((props: any) => props.marginTop = (ev.target as unknown as HTMLInputElement).value)} />
            </IonItem>

            <IonItem>
              <IonInput type='text' label='Margin Right' value={marginRight} onIonInput={(ev) => setProp((props: any) => props.marginRight = (ev.target as unknown as HTMLInputElement).value)} />
            </IonItem>

            <IonItem>
              <IonInput type='text' label='Margin Bottom' value={marginBottom} onIonInput={(ev) => setProp((props: any) => props.marginBottom = (ev.target as unknown as HTMLInputElement).value)} />
            </IonItem>

            <IonItem>
              <IonInput type='text' label='Margin Left' value={marginLeft} onIonInput={(ev) => setProp((props: any) => props.marginLeft = (ev.target as unknown as HTMLInputElement).value)} />
            </IonItem>

            <IonItem>
              <IonInput type='text' label='Padding Top' value={paddingTop} onIonInput={(ev) => setProp((props: any) => props.paddingTop = (ev.target as unknown as HTMLInputElement).value)} />
            </IonItem>

            <IonItem>
              <IonInput type='text' label='Padding Right' value={paddingRight} onIonInput={(ev) => setProp((props: any) => props.paddingRight = (ev.target as unknown as HTMLInputElement).value)} />
            </IonItem>

            <IonItem>
              <IonInput type='text' label='Padding Bottom' value={paddingBottom} onIonInput={(ev) => setProp((props: any) => props.paddingBottom = (ev.target as unknown as HTMLInputElement).value)} />
            </IonItem>

            <IonItem>
              <IonInput type='text' label='Padding Left' value={paddingLeft} onIonInput={(ev) => setProp((props: any) => props.paddingLeft = (ev.target as unknown as HTMLInputElement).value)} />
            </IonItem>

            <IonItem>
              <IonInput type='text' label='Width' value={width} onIonInput={(ev) => setProp((props: any) => props.width = (ev.target as unknown as HTMLInputElement).value)} />
            </IonItem>

            <IonItem>
              <IonInput type='text' label='Height' value={height} onIonInput={(ev) => setProp((props: any) => props.height = (ev.target as unknown as HTMLInputElement).value)} />
            </IonItem>

            <IonItem>
              <IonInput type='text' label='Max Width' value={maxWidth} onIonInput={(ev) => setProp((props: any) => props.maxWidth = (ev.target as unknown as HTMLInputElement).value)} />
            </IonItem>

            <IonItem>
              <IonInput type='text' label='Max Height' value={maxHeight} onIonInput={(ev) => setProp((props: any) => props.maxHeight = (ev.target as unknown as HTMLInputElement).value)} />
            </IonItem>

            <IonItem>
              <IonInput type='text' label='Min Width' value={minWidth} onIonInput={(ev) => setProp((props: any) => props.minWidth = (ev.target as unknown as HTMLInputElement).value)} />
            </IonItem>

            <IonItem>
              <IonInput type='text' label='Min Height' value={minHeight} onIonInput={(ev) => setProp((props: any) => props.minHeight = (ev.target as unknown as HTMLInputElement).value)} />
            </IonItem>
          </IonList>
        </div>
      </IonAccordion>

      <IonAccordion value='border'>
        <IonItem slot='header' color='light'>
          <IonLabel>Border</IonLabel>
        </IonItem>
        <div className='ion-padding' slot='content'>
          <IonList>
            <IonItem>
              Border Width
            </IonItem>

            <IonItem>
              Border Style
            </IonItem>

            <IonItem>
              Border Color
            </IonItem>

            <IonItem>
              Border Radius
            </IonItem>
          </IonList>
        </div>
      </IonAccordion>

      <IonAccordion value='background'>
        <IonItem slot='header' color='light'>
          <IonLabel>Background</IonLabel>
        </IonItem>
        <div className='ion-padding' slot='content'>
          <IonList>
            <IonItem>
              <IonInput type='text' label='Background Color' labelPlacement='floating' value={background} onIonInput={(ev) => setProp((props: any) => props.background = (ev.target as unknown as HTMLInputElement).value)} />
            </IonItem>

            <IonItem>
              Background Image
            </IonItem>

            <IonItem>
              Background Size
            </IonItem>

            <IonItem>
              Background Repeat
            </IonItem>

            <IonItem>
              Background Position
            </IonItem>
          </IonList>
        </div>
      </IonAccordion>
    </IonAccordionGroup>
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