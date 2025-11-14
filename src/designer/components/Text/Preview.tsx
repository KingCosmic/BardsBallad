import { useEffect, useMemo, useState } from 'react'
import { useLocalData } from '@designer/renderer/Context'
import { TextProps } from './Editor'

import styles from './styles'
import globalStyles from '@designer/styles'
import runCode from '@utils/verse/runCode'

export default (props: TextProps) => {
  const localData = useLocalData()

  const [text, setText] = useState('SE')

  useEffect(() => {
    async function rc() {
      if (!props.useScriptValue) return setText(props.text!)

      if (!props.script.isCorrect) return setText('SE')

      const output = await runCode<string>(props.script.compiled, localData);

      console.log(output)

      setText(output.result ?? '')
    }

    rc()
  }, [props.script, localData, props.useScriptValue, props.text])

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
