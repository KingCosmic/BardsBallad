import { useMemo } from 'react'
import { useNode, UserComponentConfig } from '@craftjs/core'

import { getDefaultNodes } from '@blueprints/utils'
import { SelectSettings } from './Settings'

import globalStyles from '@designer/styles'
import { BlueprintProcessorState } from '@utils/Blueprints/processBlueprint'
import Select from '@components/inputs/Select'
import { BlueprintData } from '@/types/blueprint'

export type SelectProps = {
  /* props that are only used in preview when processing blueprints */
  state?: BlueprintProcessorState;
  updateState?(newState: BlueprintProcessorState): void;

  /* Component Props */
  label?: string;

  dynamicOptions?: boolean;
  optionsBlueprint?: BlueprintData;
  options?: [];
  onChange?: BlueprintData;

  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  width?: string;
  maxWidth?: string;
  minWidth?: string;

  // Local state this component will pass to its children.
  local?: any;
  // calculated local state based off the parent components.
  calculateLocalState?: any;
}

function EditorSelect(props: SelectProps) {
  const { connectors: { connect, drag } } = useNode()

  const options = useMemo(() => {
    return []
  }, []) as any[]

  return (
    // @ts-ignore
    <Select ref={ref => connect(drag(ref!))}
      style={{
        marginTop: globalStyles.spacing[props.marginTop!],
        marginRight: globalStyles.spacing[props.marginRight!],
        marginBottom: globalStyles.spacing[props.marginBottom!],
        marginLeft: globalStyles.spacing[props.marginLeft!],

        width: globalStyles.size[props.width!],
        maxWidth: globalStyles.size[props.maxWidth!],
        minWidth: globalStyles.size[props.minWidth!],
      }}
      id={props.label!} label={props.label!} value={options[0]?.name} onChange={() => {}}>
      {options.map(o => <option key={o.name}>{o.name}</option>)}
    </Select>
  )
}

const CraftSettings: Partial<UserComponentConfig<SelectProps>> = {
  defaultProps: {
    label: 'Select',

    dynamicOptions: false,
    optionsBlueprint: {
      nodes: getDefaultNodes([], { name: 'options', type: 'any', isArray: true }),
      edges: []
    },
    options: [],
    onChange: {
      nodes: getDefaultNodes([
        {
          name: 'selectedValue',
          type: 'object',
          isArray: false
        }
      ]),
      edges: [],
    },

    marginTop: '0',
    marginRight: '0',
    marginBottom: '0',
    marginLeft: '0',

    width: 'auto',
    maxWidth: 'none',
    minWidth: 'none',

    local: [],
  },
  rules: {},
  related: {
    settings: SelectSettings
  }
}

EditorSelect.craft = CraftSettings

export default EditorSelect
