import { PropsWithChildren, useMemo } from 'react'
import { NodeHelpersType, Node, useNode, UserComponentConfig } from '@craftjs/core'


import { getDefaultNodes } from '@blueprints/utils'
import { ContainerSettings } from './Settings'
import styles from './styles'
import globalStyles from '@designer/styles'
import { BlueprintProcessorState } from '@utils/Blueprints/processBlueprint'
import { BlueprintData } from '@/types/blueprint'

export type ContainerProps = {
  /* props that are only used in preview when processing blueprints */
  state?: BlueprintProcessorState;
  updateState?(newState: BlueprintProcessorState): void;

  showPlaceholder?: boolean;

  dynamicVisibility?: boolean;
  visibilityBlueprint?: BlueprintData;
  isVisible?: boolean;

  isList?: boolean;
  dataName?: string;
  blueprint?: BlueprintData;

  isInteractive?: boolean;
  onPress?: BlueprintData;

  background?: string;
  border?: string;
  hover?: string;

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

  // Local state this component will pass to its children.
  local?: any;
  // calculated local state based off the parent components.
  calculateLocalState?: any;
}

function Container(props: PropsWithChildren<ContainerProps>) {
  const { connectors: { connect, drag } } = useNode()

  const backgroundClass = useMemo(() => styles[props.background!] ? styles[props.background!]?.background : '', [props.background])
  const borderClass = useMemo(() => styles[props.border!] ? styles[props.border!]?.border : '', [props.border])
  const hoverClass = useMemo(() => props.isInteractive ? styles[props.hover!]?.hover : '', [props.isInteractive])

  return (
    <div ref={ref => connect(drag(ref!))}
      style={{
        display: props.display,
        // @ts-ignore
        position: props.position!,
        top: props.top,
        right: props.right,
        bottom: props.bottom,
        left: props.left,

        // @ts-ignore
        flexDirection: props.flexDirection,
        alignItems: props.alignItems,
        justifyContent: props.justifyContent,

        rows: props.rows,
        columns: props.columns,

        gap: globalStyles.spacing[props.gap!],

        marginTop: globalStyles.spacing[props.marginTop!],
        marginRight: globalStyles.spacing[props.marginRight!],
        marginBottom: globalStyles.spacing[props.marginBottom!],
        marginLeft: globalStyles.spacing[props.marginLeft!],

        paddingTop: globalStyles.spacing[props.paddingTop!],
        paddingRight: globalStyles.spacing[props.paddingRight!],
        paddingBottom: globalStyles.spacing[props.paddingBottom!],
        paddingLeft: globalStyles.spacing[props.paddingLeft!],

        height: globalStyles.size[props.height!],
        width: globalStyles.size[props.width!],
        maxHeight: globalStyles.size[props.maxHeight!],
        maxWidth: globalStyles.size[props.maxWidth!],
        minHeight: globalStyles.size[props.minHeight!],
        minWidth: globalStyles.size[props.minWidth!],
      }}

      className={`${backgroundClass} ${borderClass} ${hoverClass}`}
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

    isInteractive: false,
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
    gap: '0',
    rows: 0,
    columns: 0,

    marginTop: '0',
    marginRight: '0',
    marginBottom: '0',
    marginLeft: '0',
    paddingTop: '4',
    paddingRight: '4',
    paddingBottom: '4',
    paddingLeft: '4',
    height: 'auto',
    width: 'auto',
    maxHeight: 'none',
    maxWidth: 'none',
    minHeight: 'none',
    minWidth: 'none',

    background: 'no style',
    border: 'no style',
    hover: 'no style'
  },
  rules: {
    canMoveIn: (_incoming: Node[], current: Node, _helpers: NodeHelpersType) => {
      return (current.data.props.isList) ? (current.data.nodes.length === 0) : true
    }
  },
  related: {
    settings: ContainerSettings
  }
}

Container.craft = CraftSettings

export default Container
