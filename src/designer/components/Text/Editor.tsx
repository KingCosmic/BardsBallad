import { useNode, UserComponentConfig } from '@craftjs/core'
import { getDefaultNodes } from '@blueprints/utils'
import { BlueprintData } from '@/types/blueprint'
import TextSettings from './Settings'

import styles from './styles'
import { useMemo } from 'react'
import globalStyles from '@designer/styles'
import { BlueprintProcessorState } from '@utils/Blueprints/processBlueprint'

export interface TextProps {
  /* props that are only used in preview when processing blueprints */
  state?: BlueprintProcessorState;
  updateState?(newState: BlueprintProcessorState): void;
  
  useBlueprintValue?: boolean;
  blueprint?: BlueprintData;

  text?: string;
  color?: string;
  fontSize?: string;

  fontWeight?: string;

  textAlign?: string;
  textDecoration?: string;
  textTransform?: string;

  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;

  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;

  // Local state this component will pass to its children.
  local?: any;
  // calculated local state based off the parent components.
  calculateLocalState?: any;
}

function Text(props: TextProps) {
  const { connectors: { connect, drag } } = useNode()

  const colorClass = useMemo(() => styles.colors[props.color!] ? styles.colors[props.color!]?.text : '', [props.color])
  const weightClass = useMemo(() => styles.weight[props.fontWeight!] ? styles.weight[props.fontWeight!] : '', [props.fontWeight])
  // const hoverClass = useMemo(() => props.isInteractive ? styles[props.hover!]?.hover : '', [props.isInteractive])

  return (
    // @ts-ignore
    <p ref={ref => connect(drag(ref!))}
    style={{
      // fontSize?: string;

      // fontWeight?: string;

      // @ts-ignore
      textAlign: props.textAlign!,

      ...styles.sizes[props.fontSize!] || {},

      textDecoration: props.textDecoration,
      // @ts-ignore
      textTransform: props.textTransform,

      marginTop: globalStyles.spacing[props.marginTop!],
      marginRight: globalStyles.spacing[props.marginRight!],
      marginBottom: globalStyles.spacing[props.marginBottom!],
      marginLeft: globalStyles.spacing[props.marginLeft!],

      paddingTop: globalStyles.spacing[props.paddingTop!],
      paddingRight: globalStyles.spacing[props.paddingRight!],
      paddingBottom: globalStyles.spacing[props.paddingBottom!],
      paddingLeft: globalStyles.spacing[props.paddingLeft!],
    }}

    className={`${colorClass} ${weightClass}`}
    >{props.text}</p>
  )
}

const CraftSettings: Partial<UserComponentConfig<TextProps>> = {
  defaultProps: {
    useBlueprintValue: false,
    blueprint: { nodes: getDefaultNodes([], { name: 'output', type: 'string', isArray: false }), edges: [] },

    text: 'hello world',
    color: 'base',
    fontSize: 'base',

    textAlign: 'left',
    textDecoration: 'none',
    textTransform: 'none',

    marginTop: '0',
    marginRight: '0',
    marginBottom: '0',
    marginLeft: '0',

    paddingTop: '0',
    paddingRight: '0',
    paddingBottom: '0',
    paddingLeft: '0',
  },
  rules: {},
  related: {
    settings: TextSettings
  }
}

Text.craft = CraftSettings

export default Text
