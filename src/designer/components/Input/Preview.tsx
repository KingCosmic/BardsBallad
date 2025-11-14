import { useCallback, useEffect, useMemo, useState } from 'react'

import { useLocalData } from '@designer/renderer/Context'

import { InputProps } from './Editor'
import globalStyles from '@designer/styles'
import TextInput from '@components/inputs/TextInput'
import runCode from '@utils/verse/runCode'

export default (props: InputProps) => {
  const localData = useLocalData()

  const [value, setValue] = useState('')

  useEffect(() => {
    async function rc() {
      if (!props.getValue.isCorrect) return setValue('')

      const output = await runCode<string>(props.getValue.compiled, localData)

      setValue(output.result ?? '')
    }

    rc()
  }, [props.getValue, localData, props.state, props.updateState])

  const onChange = useCallback((value: any) => {
    if (!props.onChange.isCorrect) return

    runCode(props.onChange.compiled, { ...localData, ['field value']: value })
  }, [props.onChange, localData, props.state, props.updateState])

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
