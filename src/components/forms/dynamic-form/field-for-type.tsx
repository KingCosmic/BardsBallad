import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import TypeSelect from "@/components/ui/type-select";
import { SystemType, TypeData } from "@/db/system/schema";
import ScriptEditor from "@/modals/editors/script-editor";
import { openModal } from "@/state/modals";
import generateObject from "@/utils/object/generateObject";
import { useEffect } from "react";
import ArrayEdit from "../array-edit";
import { Field } from "@/components/ui/field";

interface Props {
  types: SystemType[];
  type: string;
  data: any;
  dataRoot: any;
  typeData?: TypeData;
  path: string;
  onChange(path:string, value:any): void
}

export default function FieldForType({
  types, type, data, dataRoot, typeData, path, onChange
}: Props) {
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

    const defaultForType = (t: string) => {
      return generateObject(types, t)
    }

    const items: any[] = Array.isArray(data) ? data : []

    return (
      <div className='mb-2'>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <p>{formatLabel(path)} <span className='text-sm text-neutral-500'>({items.length})</span></p>
          <Button color='primary' onClick={() => onChange(path, [ ...items, defaultForType(elementType) ])}>Add</Button>
        </div>

        <Separator />

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
      return (
        <Field>
          <Label>{formatLabel(path)}</Label>
          {typeData?.useTextArea ? (
            <Textarea id={path} value={data} onChange={val => onChange(path, val.currentTarget.value)} />
          ) : (
            <Input id={path} value={data} onChange={val => onChange(path, val.currentTarget.value)} />
          )}
        </Field>
      )
    case 'number':
      return (
        <Field>
          <Label>{formatLabel(path)}</Label>
          <Input type='number' value={data} onChange={val => onChange(path, val.currentTarget.valueAsNumber)} />
        </Field>
      )
    case 'boolean':
      return (
        <Field orientation='horizontal'>
          <Checkbox checked={!!data} onCheckedChange={val => onChange(path, val.valueOf())} />
          <Label>{formatLabel(path)}</Label>
        </Field>
      )
    case 'enum':
      return (
        <Field>
          <Label>{formatLabel(path)}</Label>
          <Select value={data} onValueChange={val => onChange(path, val)}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Select option' />
            </SelectTrigger>
            <SelectContent>
              {typeData?.options?.map((option: string) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
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
                <Checkbox id='is-manual' checked={!!calc.isManual} onCheckedChange={checked => onChange(`${path}/isManual`, !!checked)} />
                <Label>Is Manual?</Label>

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
        <div className='flex flex-col gap-4'>
          <p className='my-2'>{formatLabel(path)}</p>
          <Separator />
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