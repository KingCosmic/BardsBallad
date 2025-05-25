import { useMemo } from 'react'
import { useNode, UserComponentConfig } from '@craftjs/core'

import { getDefaultNodes } from '@blueprints/utils'
import { SelectSettings } from './Settings'

import globalStyles from '@designer/styles'
import { BlueprintProcessorState } from '@utils/Blueprints/processBlueprint'
import { BlueprintData } from '@/types/blueprint'
import TextInput from '@components/inputs/TextInput'

export type InputProps = {
  /* props that are only used in preview when processing blueprints */
  state?: BlueprintProcessorState;
  updateState?(newState: BlueprintProcessorState): void;

  /* Component Props */
  label?: string;
  type?: 'text' | 'number';

  minNumber?: number;
  maxNumber?: number;

  getValue?: BlueprintData;
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

function EditorInput(props: InputProps) {
  const { connectors: { connect, drag } } = useNode()

  return (
    // @ts-ignore
    <TextInput ref={ref => connect(drag(ref!))}
      style={{
        marginTop: globalStyles.spacing[props.marginTop!],
        marginRight: globalStyles.spacing[props.marginRight!],
        marginBottom: globalStyles.spacing[props.marginBottom!],
        marginLeft: globalStyles.spacing[props.marginLeft!],

        width: globalStyles.size[props.width!],
        maxWidth: globalStyles.size[props.maxWidth!],
        minWidth: globalStyles.size[props.minWidth!],
      }}
      type={props.type!}
      minNumber={props.minNumber!}
      maxNumber={props.maxNumber!}
      isValid
      errorMessage=''
      id={props.label!} label={props.label!} value='' onChange={() => {}}
    />
  )
}

const CraftSettings: Partial<UserComponentConfig<InputProps>> = {
  defaultProps: {
    label: 'Select',
    type: 'text',

    minNumber: 0,
    maxNumber: 100,

    getValue: {
      nodes: getDefaultNodes([], { name: 'value', type: 'string', isArray: false }),
      edges: [],
    },
    onChange: {
      nodes: getDefaultNodes([
        {
          name: 'field value',
          type: 'string',
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

EditorInput.craft = CraftSettings

export default EditorInput
