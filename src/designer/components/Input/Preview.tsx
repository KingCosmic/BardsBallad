import { useCallback, useEffect, useMemo, useState } from 'react'

import { useLocalData } from '@designer/renderer/Context'

import { InputProps } from './Editor'
import globalStyles from '@designer/styles'
import TextInput from '@components/inputs/TextInput'
import runCode from '@utils/verse/runCode'
import { useScriptRunner } from '@components/ScriptRunnerContext'

export default (props: InputProps) => {
  const localData = useLocalData()
  const { isReady, runScript } = useScriptRunner()

  const [value, setValue] = useState('')

  const state = useMemo(() => ({
    ...props.state,
    ...localData,
  }), [localData, props.state])

  useEffect(() => {
    async function rc() {
      if (!props.getValue!.isCorrect || !isReady) return setValue('')

      const output = await runScript<string>(props.getValue!.compiled, state, props.updateState!)

      setValue(output.result ?? '')
    }

    rc()
  }, [props.getValue, state, props.updateState])

  const onChange = useCallback((value: any) => {
    if (!props.onChange!.isCorrect || !isReady) return

    runScript(props.onChange!.compiled, { ...state, ['field value']: value }, props.updateState!)
  }, [props.onChange, state, props.updateState])

  return (
    <TextInput
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
      type={props.type!}
      minNumber={props.minNumber!}
      maxNumber={props.maxNumber!}
      value={value}
      onChange={val => onChange(val)}

      isValid
      errorMessage=''
    />
  )
}
