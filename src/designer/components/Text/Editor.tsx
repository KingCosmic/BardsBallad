import { useNode, UserComponentConfig } from '@craftjs/core'
import { getDefaultNodes } from '../../../blueprints/utils'
import { BlueprintData } from '../../../state/systems'
import TextSettings from './Settings'

export interface TextProps {
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
}

function Text(props: TextProps) {
  const { connectors: { connect, drag } } = useNode()

  return (
    // @ts-ignore
    <p ref={ref => connect(drag(ref!))} style={{ ...props }}>{props.text}</p>
  )
}

const CraftSettings: Partial<UserComponentConfig<TextProps>> = {
  defaultProps: {
    useBlueprintValue: false,
    blueprint: { nodes: getDefaultNodes([], { name: 'output', type: 'string', isArray: false }), edges: [] },

    text: 'text',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 'normal',
    textAlign: 'left',
    textDecoration: 'none',
    textTransform: 'none',
    marginTop: '0px',
    marginRight: '0px',
    marginBottom: '0px',
    marginLeft: '0px',
    paddingTop: '0px',
    paddingRight: '0px',
    paddingBottom: '0px',
    paddingLeft: '0px',
  },
  rules: {},
  related: {
    settings: TextSettings
  }
}

Text.craft = CraftSettings

export default Text