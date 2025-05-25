import { memo, useCallback, useMemo, useState } from 'react'

import { useLocalData } from '@designer/renderer/Context'
import BlueprintProcessor from '@utils/Blueprints/processBlueprint'

import { SelectProps } from './Editor'
import globalStyles from '@designer/styles'
import Select from '@components/inputs/Select'

export default (props: SelectProps) => {
  const localData = useLocalData()

  const [value, setValue] = useState('default')

  const options = useMemo(() => {
    if (!props.dynamicOptions) return props.options!

    const processor = new BlueprintProcessor(props.optionsBlueprint!)

    const output = (processor.processBlueprint(localData, props.state!, props.updateState!) ?? []) as any[]

    return output
  }, [localData, props.state, props.updateState])

  const onChange = useCallback((value: any) => {
    const processor = new BlueprintProcessor(props.onChange!)

    processor.processBlueprint({ ...localData, ['selectedValue']: value }, props.state!, props.updateState!)
  }, [props.onChange, localData, props.state, props.updateState])

  return (
    <Select
      style={{
        marginTop: globalStyles.spacing[props.marginTop!],
        marginRight: globalStyles.spacing[props.marginRight!],
        marginBottom: globalStyles.spacing[props.marginBottom!],
        marginLeft: globalStyles.spacing[props.marginLeft!],

        width: globalStyles.size[props.width!],
        maxWidth: globalStyles.size[props.maxWidth!],
        minWidth: globalStyles.size[props.minWidth!],
      }}

      id={props.label!}
      label={props.label!}
      value={value}
      onChange={val => {
        setValue(val)
        onChange(options.find(o => o.name === val))
      }}
    >
      <option disabled={true} value='default'>Select an option...</option>
      {options.map(o => <option key={o.name} value={o.name}>{o.name}</option>)}
    </Select>
  )
}
