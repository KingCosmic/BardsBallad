import { IonAccordion, IonAccordionGroup, IonCheckbox, IonInput, IonItem, IonLabel, IonList } from '@ionic/react'

import { useNode } from '@craftjs/core'
import { useLocalState } from '../hooks/useLocalState'
import { getDefaultNodes, updateParams } from '../../blueprints/utils'
import { openModal } from '../../state/modals'
import { BlueprintData } from '../../state/systems'
import { useEffect, useMemo } from 'react'
import BlueprintProcessor from '../../utils/Blueprints/processBlueprint'
import { useLocalData } from '../renderer/Context'

interface Props {
  useBlueprintValue?: boolean,
  blueprint?: BlueprintData,
  text?: string;
  fontSize?: number;

  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
}

function Text(props: Props) {
  const { connectors: { connect, drag } } = useNode()

  return (
    <p ref={ref => connect(drag(ref!))} style={{ ...props }}>{props.text}</p>
  )
}

export function TextPreview(props: Props) {
  const localData = useLocalData()

  const text = useMemo(() => {
    if (!props.useBlueprintValue) return props.text

    const processor = new BlueprintProcessor(props.blueprint!)

    const output = processor.processBlueprint(localData)

    return output || ''
  }, [props.blueprint, localData, props.useBlueprintValue, props.text])

  return <p style={{ ...props }}>{text}</p>
}

function TextSettings() {
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
    <IonAccordionGroup>
      <IonAccordion value='Content'>
        <IonItem slot='header' color='light'>
          <IonLabel>Content</IonLabel>
        </IonItem>
        <div className='ion-padding' slot='content'>
          <IonList>
            <IonItem>
              <IonCheckbox labelPlacement='start' checked={useBlueprintValue} onIonChange={() => setProp((props: any) => props.useBlueprintValue = !useBlueprintValue)}>Use blueprint value?</IonCheckbox>
            </IonItem>

            {
              useBlueprintValue ? (
                <IonItem button={true} onClick={() => openModal({
                  type: 'blueprint',
                  title: '',
                  data: blueprint,
                  onSave: (blueprint) => setProp((props: any) => props.blueprint = Object.assign({}, blueprint))
                })}>
                  Blueprint Value
                </IonItem>
              ) : (
                <IonItem>
                  <IonInput label='text' placeholder='lorem ipsum' value={text} onIonChange={(ev: Event) => {
                    const val = (ev.target as HTMLIonInputElement).value as string

                    setProp((props: any) => props.text = val)
                  }} />
                </IonItem>
              )
            }
          </IonList>
        </div>
      </IonAccordion>
      <IonAccordion value='ContentStyling'>
        <IonItem slot='header' color='light'>
          <IonLabel>Content Styling</IonLabel>
        </IonItem>
        <div className='ion-padding' slot='content'>
          <IonList>
            <IonItem>
              <IonInput label='Color' placeholder='#232323' value={color} onIonChange={(ev: Event) => {
                const val = (ev.target as HTMLIonInputElement).value as string

                setProp((props: any) => props.color = val)
              }} />
            </IonItem>

            <IonItem>
              <IonInput label='Font Family' placeholder='Arial, Times New Roman' value={fontFamily} onIonChange={(ev: Event) => {
                const val = (ev.target as HTMLIonInputElement).value as string

                setProp((props: any) => props.fontFamily = val)
              }} />
            </IonItem>

            <IonItem>
              <IonInput label='Font Size' placeholder='23px' value={fontSize} onIonChange={(ev: Event) => {
                const val = (ev.target as HTMLIonInputElement).value as string

                setProp((props: any) => props.fontSize = val)
              }} />
            </IonItem>

            <IonItem>
              <IonInput label='Font Weight' placeholder='bold / 400' value={fontWeight} onIonChange={(ev: Event) => {
                const val = (ev.target as HTMLIonInputElement).value as string

                setProp((props: any) => props.fontWeight = val)
              }} />
            </IonItem>

            <IonItem>
              <IonInput label='Font Style' placeholder='normal / italic' value={fontStyle} onIonChange={(ev: Event) => {
                const val = (ev.target as HTMLIonInputElement).value as string

                setProp((props: any) => props.fontStyle = val)
              }} />
            </IonItem>

            <IonItem>
              <IonInput label='Letter Spacing' placeholder='2px' value={letterSpacing} onIonChange={(ev: Event) => {
                const val = (ev.target as HTMLIonInputElement).value as string

                setProp((props: any) => props.letterSpacing = val)
              }} />
            </IonItem>

            <IonItem>
              <IonInput label='Line Height' placeholder='1.5' value={lineHeight} onIonChange={(ev: Event) => {
                const val = (ev.target as HTMLIonInputElement).value as string

                setProp((props: any) => props.lineHeight = val)
              }} />
            </IonItem>

            <IonItem>
              <IonInput label='Align' placeholder='left / center / right / justify' value={textAlign} onIonChange={(ev: Event) => {
                const val = (ev.target as HTMLIonInputElement).value as string

                setProp((props: any) => props.textAlign = val)
              }} />
            </IonItem>

            <IonItem>
              <IonInput label='Decoration' placeholder='underline / line-through / none' value={textDecoration} onIonChange={(ev: Event) => {
                const val = (ev.target as HTMLIonInputElement).value as string

                setProp((props: any) => props.textDecoration = val)
              }} />
            </IonItem>

            <IonItem>
              <IonInput label='Transform' placeholder='none / uppercsae / lowercase / capitalize' value={textTransform} onIonChange={(ev: Event) => {
                const val = (ev.target as HTMLIonInputElement).value as string

                setProp((props: any) => props.textTransform = val)
              }} />
            </IonItem>
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
          </IonList>
        </div>
      </IonAccordion>
    </IonAccordionGroup>
  )
}

Text.craft = {
  rules: {},
  related: {
    settings: TextSettings
  }
}

export default Text