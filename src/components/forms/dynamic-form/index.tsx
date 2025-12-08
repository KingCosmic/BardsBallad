import { type SystemType, type TypeData } from '@/db/system/schema'
import FieldForType from './field-for-type'

type Props = {
  types: SystemType[]
  value: any
  typeName?: string
  basePath?: string
  typeData?: TypeData
  onChange(path: string, value: any): void
}

export default function DynamicForm({ types, value, typeName, basePath = '', typeData, onChange }: Props) {
  const rootTypeName = typeName || value?._type

  // No structured properties: treat this as a primitive root. Render a single field
  if (!rootTypeName) return <div />

  const rootPath = basePath || ''
  const rootTypeData = typeData ?? value?.typeData

  return (
    <FieldForType
      types={types}
      type={rootTypeName}
      data={value}
      dataRoot={value}
      typeData={rootTypeData as TypeData}
      path={rootPath}
      onChange={onChange}
    />
  )
}
