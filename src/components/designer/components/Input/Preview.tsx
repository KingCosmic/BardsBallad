import { useCallback, useEffect, useMemo, useState } from 'react'

import { InputProps } from './Editor'
import { useLocalData } from '../../renderer/Context'
import { useScriptRunner } from '@/components/providers/script-runner'
import globalStyles from '../../styles'
import { Input } from '@/components/ui/input'

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

      const output = await runScript<string>(undefined, props.getValue!, state, props.updateState!)

      setValue(output.result ?? '')
    }

    rc()
  }, [props.getValue, state, props.updateState])

  const onChange = useCallback((value: any) => {
    if (!props.onChange!.isCorrect || !isReady) return

    runScript(undefined, props.onChange!, { ...state, ['field value']: value }, props.updateState!)
  }, [props.onChange, state, props.updateState])

  return (
    <Input
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
      type={props.type!}
      value={value}
      onChange={val => onChange(val)}
    />
  )
}
