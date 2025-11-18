import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocalData } from '@designer/renderer/Context'
import { TextProps } from './Editor'

import styles from './styles'
import globalStyles from '@designer/styles'
import { useScriptRunner } from '@components/ScriptRunnerContext'

export default (props: TextProps) => {
  const localData = useLocalData()
  const { isReady, runScript } = useScriptRunner()

  const [text, setText] = useState('SE')

  const state = useMemo(() => ({
    ...props.state,
    ...localData,
  }), [localData, props.state])

  useEffect(() => {
    function rc() {
      if (!isReady) return
      if (!props.useScriptValue) return setText(props.text!)

      if (!props.script!.isCorrect) return setText('SE')

      runScript<string>(props.script!.compiled, state, props.updateState!).then(output => setText(output.result ?? ''));
    }

    rc()
  }, [props.script, state, props.useScriptValue, props.text, props.updateState])

  const colorClass = useMemo(() => styles.colors[props.color!] ? styles.colors[props.color!]?.text : '', [props.color])
  const weightClass = useMemo(() => styles.weight[props.fontWeight!] ? styles.weight[props.fontWeight!] : '', [props.fontWeight])

  // @ts-ignore
  return <p
    style={{
      // fontSize?: string;

      // fontWeight?: string;

      // @ts-ignore
      textAlign: props.textAlign!,

      ...styles.sizes[props.fontSize!] || {},

      textDecoration: props.textDecoration,
      // @ts-ignore
      textTransform: props.textTransform,

      marginTop: globalStyles.spacing[props.marginTop!],
      marginRight: globalStyles.spacing[props.marginRight!],
      marginBottom: globalStyles.spacing[props.marginBottom!],
      marginLeft: globalStyles.spacing[props.marginLeft!],

      paddingTop: globalStyles.spacing[props.paddingTop!],
      paddingRight: globalStyles.spacing[props.paddingRight!],
      paddingBottom: globalStyles.spacing[props.paddingBottom!],
      paddingLeft: globalStyles.spacing[props.paddingLeft!],
    }}

    className={`${colorClass} ${weightClass}`}
  >{text}</p>
}
