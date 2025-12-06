import { useNode, UserComponentConfig } from '@craftjs/core'

import { SelectSettings } from './Settings'

import { Script } from '@/types/script'
import globalStyles from '../../styles';

export type InputProps = {
  /* props that are only used in preview when processing blueprints */
  state?: any;
  updateState?(newState: any): void;

  /* Component Props */
  label?: string;
  type?: 'text' | 'number';

  minNumber?: number;
  maxNumber?: number;

  getValue?: Script;
  onChange?: Script;

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
      source: '',
      compiled: '',
      isCorrect: false
    },
    onChange: {
      source: '',
      compiled: '',
      isCorrect: false
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
