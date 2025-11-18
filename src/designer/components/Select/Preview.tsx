import { memo, useCallback, useEffect, useMemo, useState } from 'react'

import { useLocalData } from '@designer/renderer/Context'
import BlueprintProcessor from '@utils/Blueprints/processBlueprint'

import { SelectProps } from './Editor'
import globalStyles from '@designer/styles'
import Select from '@components/inputs/Select'
import runCode from '@utils/verse/runCode'
import { useScriptRunner } from '@components/ScriptRunnerContext'

export default (props: SelectProps) => {
  const localData = useLocalData()
  const { isReady, runScript } = useScriptRunner()

  const [value, setValue] = useState('default')
  const [options, setOptions] = useState<any[]>([])

  const state = useMemo(() => ({
    ...props.state,
    ...localData,
  }), [localData, props.state])

  useEffect(() => {
    async function rc() {
      if (!props.dynamicOptions || !isReady) return setOptions(props.options!)

      if (!props.optionsScript!.isCorrect) return setOptions([])
      
      const output = await runScript<any[]>(props.optionsScript!.compiled, state, props.updateState!);

      setOptions(output.result ?? [])
    }

    rc()
  }, [state, props.dynamicOptions, props.optionsScript, props.updateState])

  const onChange = useCallback((value: any) => {
    if (!props.onChange?.isCorrect || !isReady) return

    runScript(props.onChange.compiled, { ...state, ['selectedValue']: value }, props.updateState!)
  }, [props.onChange, state, props.updateState])

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
