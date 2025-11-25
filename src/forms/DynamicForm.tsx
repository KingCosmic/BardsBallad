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
import TypeSelect from '@components/inputs/TypeSelect'
import generateObject from '@utils/generateObject'
import { useEffect } from 'react'

type Props = {
  types: SystemType[]
  value: any
  typeName?: string
  basePath?: string
  typeData?: TypeData
  onChange(path: string, value: any): void
}

function FieldForType({ types, type, data, dataRoot, typeData, path, onChange }: { types: SystemType[]; type: string; data: any; dataRoot: any; typeData?: TypeData; path: string; onChange(path:string, value:any): void }) {

  const formatLabel = (p: string) => {
    const seg = p.split('/').pop() ?? p
    const cleaned = seg.replace(/[_-]/g, ' ')
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
  }

  // Helper to concatenate paths robustly
  const concatPath = (...segments: (string|number|undefined)[]) => segments.filter(Boolean).join('/');
  if (typeData?.isArray) {
    // element system type (object) -> delegate to ArrayEdit which handles edit-object modal
    const elemSystemType = types.find(t => t.name === type)

    if (elemSystemType) {
      return (
        <ArrayEdit
          title={path}
          data={(data || []) as any[]}
          type={elemSystemType}
          types={types}
          onAdd={(newItem: any) => onChange(path, [ ...(data || []), newItem ])}
          onChange={(p: string, v: any) => onChange(p, v)}
          onDelete={(name: string) => onChange(path, (data || []).filter((i: any) => i.name !== name))}
        />
      )
    }

    // primitive array (string/number/boolean/enum/blueprint) -> render inline list
    const elementType = type
    const elementTypeData = { ...typeData, isArray: false }

    const defaultForType = (t: string, td?: TypeData) => {
      return generateObject(types, t)
    }

    const items: any[] = Array.isArray(data) ? data : []

    return (
      <div className='mb-2'>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <p>{formatLabel(path)} <span className='text-sm text-neutral-500'>({items.length})</span></p>
          <Button color='primary' onClick={() => onChange(path, [ ...items, defaultForType(elementType, typeData) ])}>Add</Button>
        </div>

        <Divider />

        <div className='flex flex-col gap-1 mt-3'>
          {items.map((item, idx) => (
            <div key={idx} className='p-3 border border-neutral-600 dark:bg-neutral-800 hover:bg-neutral-700'>
              <div className='flex items-center justify-between gap-2'>
                <div className='flex-1'>
                  <FieldForType
                    types={types}
                    type={elementType}
                    data={item}
                    dataRoot={data}
                    typeData={elementTypeData as TypeData}
                    path={concatPath(path, idx)}
                    onChange={(_p: string, v: any) => {
                      const newArr = [ ...items ]
                      newArr[idx] = v
                      onChange(path, newArr)
                    }}
                  />
                </div>
                <div>
                  <Button color='danger' onClick={() => onChange(path, items.filter((_: any, i: number) => i !== idx))}>Delete</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
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
    case 'script':
      return (
        <Button color='light' onClick={() => openModal('script', ({ id }) => (
          // TODO: update this to make sure it gets the right data for globals and expected type.
          <ScriptEditor id={id} types={types} code={data} expectedType={typeData?.outputType ?? 'null'} globals={[]} onSave={(script:any) => onChange(path, script)} />
        ))}>Edit {formatLabel(path)}</Button>
      )
    case 'Calculation':
      return (
        <>
          {(() => {
            const calc = data

            useEffect(() => {
              if (!data) onChange(path, { _type: 'Calculation', isManual: false, valueType: 'string', value: null, script: { source: '', compiled: '', isCorrect: true, blueprint: { nodes: [], edges: [] } } })
            }, [data])

            return (
              <div className='my-2'>
                <p className='mb-2'>{formatLabel(path)}</p>
                <Checkbox id='is-manual' label='Is Manual?' checked={!!calc.isManual} onChange={val => onChange(`${path}/isManual`, val)} />

                <div className='h-2' />

                <TypeSelect id='value-type' label='Value Type' types={types} value={calc.valueType || 'string'} onChange={valueType => onChange(`${path}/valueType`, valueType)} includeBuiltins={true} />

                <div className='h-2' />

                {/* Value field (use nested path so FieldForType edits work as expected) */}
                <FieldForType types={types} type={calc.valueType || 'string'} data={calc.value} dataRoot={dataRoot} typeData={undefined} path={`${path}/value`} onChange={(p: string, v: any) => onChange(p, v)} />

                <div className='h-2' />

                <Button color='light' onClick={() => openModal('script', ({ id }) => (
                  <ScriptEditor id={id} types={types} code={calc.script} expectedType={calc.valueType} globals={[]} onSave={(saved:any) => {
                    const scriptToStore = saved?.result ?? saved
                    onChange(`${path}/script`, scriptToStore)
                  }} />
                ))}>
                  Edit {formatLabel(path)}
                </Button>
              </div>
            )
          })()}
        </>
      )
    default:
      const systemType = types.find(t => t.name === type)
      if (!systemType) return <div />
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
                path={concatPath(path, prop.key)}
                onChange={(p, v) => onChange(p, v)}
              />
            ))
          }
        </div>
      )
  }
}

export default function DynamicForm({ types, value, typeName, basePath = '', typeData, onChange }: Props) {
  const rootTypeName = typeName || value?._type

  // No structured properties: treat this as a primitive root. Render a single field
  if (!rootTypeName) return <div />

  const rootPath = basePath || ''
  const rootTypeData = typeData ?? value?.typeData

  return (
    <div>
      <FieldForType
        types={types}
        type={rootTypeName}
        data={value}
        dataRoot={value}
        typeData={rootTypeData as TypeData}
        path={rootPath}
        onChange={onChange}
      />
    </div>
  )
}
