import { useEffect, useMemo, useState } from 'react'

import EditStringModal from './EditString'
import Modal from '@components/Modal'

import ModalHeader from '@components/Modal/Header'
import ModalBody from '@components/Modal/Body'
import ModalFooter from '@components/Modal/Footer'
import Button from '@components/inputs/Button'
import TextInput from '@components/inputs/TextInput'
import Select from '@components/inputs/Select'
import Checkbox from '@components/inputs/Checkbox'
import { openModal } from '@state/modals'
import { Param } from '@blueprints/utils'
import { editorState } from '@state/editor'
import { useSystem } from '@hooks/useSystem'
import { SystemData, type TypeData } from '@storage/schemas/system'
import { useVersionEdits } from '@hooks/useVersionEdits'
import EditBlueprintParamModal from './EditBlueprintParam'

type Props = {
  data: { key: string; typeData: TypeData, typeName: string } | null;

  isOpen: boolean;
  requestClose(): void;
  onSave(newData: { key: string; typeData: TypeData }): void;
  onDelete(): void;
}

const EditTypeModal: React.FC<Props> = ({ data, isOpen, requestClose, onSave, onDelete }) => {
  const [key, setKey] = useState('')
  const [propertyData, setPropertyData] = useState<TypeData>({ type: '', useTextArea: false, isArray: false, options: [], outputType: 'none', isOutputAnArray: false, inputs: [] })

  const editor = editorState.useValue()

  const version = useVersionEdits<SystemData>(editor.versionId)

  const parentType = useMemo(() => version?.data.types.find(t => t.name === data?.typeName), [data, version])

  useEffect(() => {
    if (!data) return
  
    setKey(data.key)
    setPropertyData({ ...{ useTextArea: false, isArray: false, options: [], outputType: 'none', isOutputAnArray: false, inputs: [] }, ...data.typeData })
  }, [data])

  return (
    <Modal isOpen={isOpen} onClose={requestClose}>
      <ModalHeader title='Edit Type Property' onClose={requestClose} />

      <ModalBody>
        <TextInput id='key' label='key' placeholder='baba yaga' value={key} onChange={setKey} isValid errorMessage='' />

        <Select id='type' label='Type' value={propertyData.type} onChange={type => setPropertyData({ ...propertyData, type })}>
          <option value='string'>string</option>
          
          <option value='number'>number</option>
          
          <option value='boolean'>boolean</option>
          
          <option value='enum'>enum</option>

          <option value='blueprint'>blueprint</option>

          {version?.data.types.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
        </Select>

        <Checkbox id='is-array' label='Is Array?' checked={propertyData.isArray} onChange={val => setPropertyData({ ...propertyData, isArray: val })} />

        {
          ((propertyData.type === 'string') && (!propertyData.isArray)) && (
            <Checkbox id='use-textarea' label='Use Textarea?' checked={propertyData.useTextArea} onChange={val => setPropertyData({ ...propertyData, useTextArea: val })} />
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
                    <div key={item} onClick={() => openModal('edit-string', ({ id }) => (
                      <EditStringModal id={id} data={item}
                        title='Edit Property Name'
                        onSave={(data) => {
                          let newOptions = [ ...propertyData.options || [] ]

                          const index = newOptions.findIndex(o => o === item)

                          if (index === -1) return

                          newOptions[index] = data

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

        {
          (propertyData.type === 'blueprint') && (
            <div className='mt-4'>
              <div className='flex flex-col'>
                <Select id='output-type' label='Output Type' value={propertyData.outputType || 'none'} onChange={outputType => setPropertyData({ ...propertyData, outputType })}>
                  <option value='none'>none</option>

                  <option value='string'>string</option>
                  
                  <option value='number'>number</option>
                  
                  <option value='boolean'>boolean</option>
                  
                  <option value='enum'>enum</option>

                  <option value='blueprint'>blueprint</option>
                  {version?.data?.types.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                </Select>

                <Checkbox id='is-output-an-array' label='Is Array?' checked={propertyData.isOutputAnArray} onChange={isOutputAnArray => setPropertyData({ ...propertyData, isOutputAnArray })} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <p>Inputs</p>

                <div
                  onClick={() => {
                    const index = propertyData.inputs?.findIndex(o => o.name === 'New Input')

                    if (index !== -1) return

                    setPropertyData({ ...propertyData, inputs: [ ...(propertyData.inputs || []), { name: 'New Input', type: 'string', isArray: false } ] })
                  }}
                >
                  <p>Add</p>
                </div>
              </div>

              <p style={{ height: 1, width: '100%', backgroundColor: 'white', marginTop: 4, marginBottom: 4 }} />

              <div>
                {propertyData.inputs?.map((param) => {
                  return (
                    <div key={param.name}
                      className='bg-neutral-50 border border-neutral-300 text-neutral-900 p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white'
                      onClick={() =>
                        openModal('edit-blueprint-param', ({ id }) => (
                          <EditBlueprintParamModal id={id} data={param} onSave={(value: Param) => {
                            let newInputs = [ ...propertyData.inputs || [] ]
                
                            const index = newInputs.findIndex(p => p.name === param.name)
                
                            if (index === -1) return
                
                            newInputs[index] = value
                
                            setPropertyData({ ...propertyData, inputs: newInputs })
                          }} onDelete={() => {
                            const newInputs = propertyData.inputs?.filter(p => p.name !== param.name)
                            setPropertyData({ ...propertyData, inputs: newInputs })
                          }} />
                        ))}>
                      <p>{param.name} - {param.type}{param.isArray ? '(Array)' : ''}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        }
      </ModalBody>

      <ModalFooter>
        <Button color='danger'
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
      </ModalFooter>
    </Modal>
  )
}

export default EditTypeModal
