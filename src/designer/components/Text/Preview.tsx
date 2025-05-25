import { memo, useMemo } from 'react'
import BlueprintProcessor from '@utils/Blueprints/processBlueprint'
import { useLocalData } from '@designer/renderer/Context'
import { TextProps } from './Editor'

import styles from './styles'
import globalStyles from '@designer/styles'

export default (props: TextProps) => {
  const localData = useLocalData()

  const text = useMemo(() => {
    if (!props.useBlueprintValue) return props.text

    const processor = new BlueprintProcessor(props.blueprint!)

    const output = processor.processBlueprint(localData, props.state!, () => {})

    return output || ''
  }, [props.blueprint, localData, props.useBlueprintValue, props.text])

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
