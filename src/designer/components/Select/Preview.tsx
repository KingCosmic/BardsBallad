import { memo, useCallback, useEffect, useMemo, useState } from 'react'

import { useLocalData } from '@designer/renderer/Context'
import BlueprintProcessor from '@utils/Blueprints/processBlueprint'

import { SelectProps } from './Editor'
import globalStyles from '@designer/styles'
import Select from '@components/inputs/Select'
import runCode from '@utils/verse/runCode'

export default (props: SelectProps) => {
  const localData = useLocalData()

  const [value, setValue] = useState('default')
  const [options, setOptions] = useState<any[]>([])

  useEffect(() => {
    async function rc() {
      if (!props.dynamicOptions) return setOptions(props.options!)

      if (!props.optionsScript.isCorrect) return setOptions([])
      
      const output = await runCode<any[]>(props.optionsScript.compiled, localData);
  
      // const output = (processor.processBlueprint(localData, props.state!, props.updateState!) ?? []) as any[]

      setOptions(output.result ?? [])
    }

    rc()
  }, [localData, props.state, props.updateState])

  const onChange = useCallback((value: any) => {
    if (!props.onChange?.isCorrect) return

    runCode(props.onChange.compiled, { ...localData, ['selectedValue']: value })
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
