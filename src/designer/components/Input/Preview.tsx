import { memo, useCallback, useMemo } from 'react'

import { useLocalData } from '@designer/renderer/Context'
import BlueprintProcessor from '@utils/Blueprints/processBlueprint'

import { InputProps } from './Editor'
import globalStyles from '@designer/styles'
import TextInput from '@components/inputs/TextInput'

export default (props: InputProps) => {
  const localData = useLocalData()

  const value = useMemo(() => {
    const processor = new BlueprintProcessor(props.getValue!)

    return processor.processBlueprint(localData, props.state!, props.updateState!)
  }, [props.getValue, localData, props.state, props.updateState])

  const onChange = useCallback((value: any) => {
    const processor = new BlueprintProcessor(props.onChange!)

    processor.processBlueprint({ ...localData, ['field value']: value }, props.state!, props.updateState!)
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
