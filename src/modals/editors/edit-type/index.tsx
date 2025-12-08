import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SystemData, TypeData } from '@/db/system/schema';
import { useVersionEdits } from '@/hooks/versions/useVersionEdits';
import { editorState } from '@/state/editor';
import { closeModal, openModal } from '@/state/modals';
import { useCallback, useEffect, useMemo, useState } from 'react'
import EditString from '../edit-string';
import { Field } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import TypeSelect from '@/components/ui/type-select';
import { Checkbox } from '@/components/ui/checkbox';

interface Props {
  id: number;
  data: { key: string; typeData: TypeData, typeName: string }

  onSave(newData: { key: string; typeData: TypeData }): void;
  onDelete(): void;
}

const EditType: React.FC<Props> = ({ id, data, onSave, onDelete }) => {
  const [key, setKey] = useState('')
  const [propertyData, setPropertyData] = useState<TypeData>({ type: '', useTextArea: false, isArray: false, options: [], outputType: 'none', isOutputAnArray: false, inputs: [] })

  const editor = editorState.useValue()

  const version = useVersionEdits<SystemData>(editor.versionId)

  const parentType = useMemo(() => version?.data.types.find(t => t.name === data?.typeName), [data, version])

  useEffect(() => {
    if (!data || data.key === key) return
  
    setKey(data.key)
    setPropertyData({ ...{ useTextArea: false, isArray: false, options: [], outputType: 'none', isOutputAnArray: false, inputs: [] }, ...data.typeData })
  }, [data])

  const requestClose = useCallback(() => closeModal(id), [id])

  return (
    <Dialog open onOpenChange={requestClose}>
      <DialogContent className="sm:max-w-[425px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Type Property</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Field>
            <Label>Key</Label>
            <Input placeholder='baba yaga' value={key} onChange={v => setKey(v.currentTarget.value)} />
          </Field>

          <TypeSelect id='type' label='Type' types={version?.data.types || []} value={propertyData.type} onChange={type => setPropertyData({ ...propertyData, type, isArray: false })} />

          {!['string', 'number', 'boolean', 'enum', 'script', 'Calculation'].includes(propertyData.type) && (
            <Field>
              <Label>Is Array?</Label>
              {/* Check the type and see if it has a name property (arrays are required to have them) */}
              <Checkbox checked={propertyData.isArray} onCheckedChange={v => setPropertyData({ ...propertyData, isArray: v.valueOf() as boolean })} />
            </Field>
          )}

          {
            ((propertyData.type === 'string') && (!propertyData.isArray)) && (
              <Field>
                <Label>Use Textarea?</Label>
                <Checkbox  checked={propertyData.useTextArea} onCheckedChange={v => setPropertyData({ ...propertyData, useTextArea: v.valueOf() as boolean })} />
              </Field>
            )
          }

          {
            (propertyData.type === 'enum') && (
              <div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p>Options</p>

                  <div
                    onClick={() => {
                      const index = propertyData.options?.findIndex(o => o === 'New Option')

                      if (index !== -1) return

                      setPropertyData({ ...propertyData, options: [ ...propertyData.options || [], 'New Option'] })
                    }}
                  >
                    <p>Add</p>
                  </div>
                </div>

                <p style={{ height: 1, width: '100%', backgroundColor: 'white', marginTop: 4, marginBottom: 4 }} />

                <div>
                  {propertyData.options?.map((item) => {
                    return (
                      <div key={item} onClick={() => openModal('edit-option', ({ id }) => (
                        <EditString id={id} data={item}
                          title='Edit Option'
                          onSave={(data) => {
                            let newOptions = [ ...propertyData.options || [] ]

                            const index = newOptions.findIndex(o => o === item)

                            if (index === -1) return

                            newOptions[index] = data

                            setPropertyData({ ...propertyData, options: newOptions })
                          }}
                          onDelete={() => {
                            let newOptions = [ ...propertyData.options || [] ].filter(o => o !== item)

                            setPropertyData({ ...propertyData, options: newOptions })
                          }}
                        />
                      ))}>
                        <p>{item}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          }
        </DialogBody>
        <DialogFooter>
          <Button variant='destructive'
            onClick={() => {
              onDelete()
              requestClose()
            }}
            disabled={parentType?.properties.length === 1}
          >
            Delete
          </Button>

          <Button color='primary' onClick={() => {
            if (!key) return requestClose()
            if (!propertyData) return requestClose()

            const newTypeData = {
              key,
              typeData: propertyData
            }
            
            onSave(newTypeData)
            requestClose()
          }}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditType