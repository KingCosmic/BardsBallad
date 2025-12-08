import { useMemo } from 'react'
import { useNode, UserComponentConfig } from '@craftjs/core'

import { SelectSettings } from './Settings'

import { Script } from '@/types/script'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select'

export type SelectProps = {
  /* props that are only used in preview when processing blueprints */
  state?: any;
  updateState?(newState: any): void;

  /* Component Props */
  label?: string;

  dynamicOptions?: boolean;
  optionsScript?: Script;
  options?: [];
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

function EditorSelect(props: SelectProps) {
  const { connectors: { connect, drag } } = useNode()

  // @ts-ignore
  const options = useMemo(() => {
    return []
  }, []) as any[]

  return (
    // @ts-ignore
    <div ref={ref => connect(drag(ref!))}>
      <Label>{props.label}</Label>
      <Select value='' onValueChange={_val => {}}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Select Min Height' />
        </SelectTrigger>
        <SelectContent>
        </SelectContent>
      </Select>
    </div>
  )

  // return (
  //   // @ts-ignore
  //   <Select ref={ref => connect(drag(ref!))}
  //     style={{
  //       marginTop: globalStyles.spacing[props.marginTop!],
  //       marginRight: globalStyles.spacing[props.marginRight!],
  //       marginBottom: globalStyles.spacing[props.marginBottom!],
  //       marginLeft: globalStyles.spacing[props.marginLeft!],

  //       width: globalStyles.size[props.width!],
  //       maxWidth: globalStyles.size[props.maxWidth!],
  //       minWidth: globalStyles.size[props.minWidth!],
  //     }}
  //     id={props.label!} label={props.label!} value={options[0]?.name} onChange={() => {}}>
  //     {options.map(o => <option key={o.name}>{o.name}</option>)}
  //   </Select>
  // )
}

const CraftSettings: Partial<UserComponentConfig<SelectProps>> = {
  defaultProps: {
    label: 'Select',

    dynamicOptions: false,
    optionsScript: {
      source: '',
      compiled: '',
      isCorrect: false
    },
    options: [],
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

EditorSelect.craft = CraftSettings

export default EditorSelect
