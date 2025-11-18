import TextInput from '@components/inputs/TextInput'
import Textarea from '@components/inputs/Textarea'
import Checkbox from '@components/inputs/Checkbox'
import Select from '@components/inputs/Select'
import Button from '@components/inputs/Button'
import Divider from '@components/Divider'
import { openModal } from '@state/modals'
import ScriptEditor from '../modals/ScriptEditor'
import { type SystemType, type TypeData } from '@storage/schemas/system'
import ArrayEdit from '../modals/ArrayEdit'

type Props = {
  types: SystemType[]
  value: any
  typeName?: string
  basePath?: string
  onChange(path: string, value: any): void
}

function FieldForType({ types, type, data, dataRoot, typeData, path, onChange }: { types: SystemType[]; type: string; data: any; dataRoot: any; typeData: TypeData; path: string; onChange(path:string, value:any): void }) {
  const systemType = types.find(t => t.name === type)!

  const formatLabel = (p: string) => {
    const seg = p.split('/').pop() ?? p
    const cleaned = seg.replace(/[_-]/g, ' ')
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
  }

  if (typeData?.isArray) {
    return (
      <ArrayEdit
        title={path}
        data={(data || []) as any[]}
        type={systemType}
        types={types}
        onAdd={(newItem: any) => onChange(path, [ ...(data || []), newItem ])}
        onChange={(p: string, v: any) => onChange(p, v)}
        onDelete={(name: string) => onChange(path, (data || []).filter((i: any) => i.name !== name))}
      />
    )
  }

  switch (type) {
    case 'string':
      if (typeData?.useTextArea) return <Textarea id={path} label={formatLabel(path)} value={data} onChange={val => onChange(path, val)} />
      return <TextInput id={path} label={formatLabel(path)} isValid errorMessage='' value={data} onChange={val => onChange(path, val)} />
    case 'number':
      return <TextInput id={path} label={formatLabel(path)} isValid errorMessage='' value={data} onChange={val => onChange(path, +val)} />
    case 'boolean':
      return <Checkbox id={path} label={formatLabel(path)} checked={!!data} onChange={val => onChange(path, val)} />
    case 'enum':
      return (
        <Select id={path} label={formatLabel(path)} value={data} onChange={val => onChange(path, val)}>
          {typeData?.options?.map((option: string) => <option key={option} value={option}>{option}</option>)}
        </Select>
      )
    case 'blueprint':
      return (
        <Button color='light' onClick={() => openModal('script', ({ id }) => (
          <ScriptEditor id={id} types={types} code={data} expectedType={typeData?.outputType ?? 'null'} globals={[]} onSave={(script:any) => onChange(path, script)} />
        ))}>Edit {formatLabel(path)}</Button>
      )
    default:
      return (
        <div className='mb-2'>
          <p className='my-2'>{formatLabel(path)}</p>
          <Divider />
          <div className='h-2' />
          {
            systemType.properties.map(prop => (
              <FieldForType
                key={prop.key}
                types={types}
                type={prop.typeData.type}
                data={data?.[prop.key] ?? ''}
                dataRoot={dataRoot}
                typeData={prop.typeData}
                path={`${path}/${prop.key}`}
                onChange={onChange}
              />
            ))
          }
        </div>
      )
  }
}

export default function DynamicForm({ types, value, typeName, basePath = '', onChange }: Props) {
  const rootTypeName = typeName || value?._type
  const systemType = rootTypeName ? types.find(t => t.name === rootTypeName) : undefined

  const propsList: { key: string; typeData: TypeData }[] = systemType?.properties ?? []

  if (!propsList.length) return <div />

  return (
    <div>
      {propsList.map(prop => {
        const key = prop.key
        const currentPath = basePath ? `${basePath}/${key}` : key
        const currentValue = value?.[key]

        return (
          <div key={currentPath}>
            <FieldForType
              types={types}
              type={prop.typeData.type}
              data={currentValue}
              dataRoot={value}
              typeData={prop.typeData}
              path={currentPath}
              onChange={onChange}
            />
          </div>
        )
      })}
    </div>
  )
}
