import { useMemo } from 'react'
import BlueprintProcessor from '../../../utils/Blueprints/processBlueprint'
import { useLocalData } from '../../renderer/Context'
import { TextProps } from './Editor'

export default function TextPreview(props: TextProps) {
  const localData = useLocalData()

  const text = useMemo(() => {
    if (!props.useBlueprintValue) return props.text

    const processor = new BlueprintProcessor(props.blueprint!)

    const output = processor.processBlueprint(localData, props.state!, props.updateState!)

    return output || ''
  }, [props.blueprint, localData, props.useBlueprintValue, props.text])

  // @ts-ignore
  return <p style={{ ...props }}>{text}</p>
}