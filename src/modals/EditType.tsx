import { useCallback, useEffect, useMemo, useState } from 'react'

import EditStringModal from './EditString'
import Modal from '@components/Modal'

import ModalHeader from '@components/Modal/Header'
import ModalBody from '@components/Modal/Body'
import ModalFooter from '@components/Modal/Footer'
import Button from '@components/inputs/Button'
import TextInput from '@components/inputs/TextInput'
import TypeSelect from '@components/inputs/TypeSelect'
import Checkbox from '@components/inputs/Checkbox'
import { closeModal, openModal } from '@state/modals'
import { Param } from '@blueprints/utils'
import { editorState } from '@state/editor'
import { SystemData, type TypeData } from '@storage/schemas/system'
import { useVersionEdits } from '@hooks/useVersionEdits'
import EditBlueprintParamModal from './EditBlueprintParam'

type Props = {
  id: number;
  data: { key: string; typeData: TypeData, typeName: string }

  onSave(newData: { key: string; typeData: TypeData }): void;
  onDelete(): void;
}

const EditTypeModal: React.FC<Props> = ({ id, data, onSave, onDelete }) => {
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
    <Modal isOpen onClose={requestClose}>
      <ModalHeader title='Edit Type Property' onClose={requestClose} />

      <ModalBody>
        <TextInput id='key' label='key' placeholder='baba yaga' value={key} onChange={setKey} isValid errorMessage='' />

        <TypeSelect id='type' label='Type' types={version?.data.types || []} value={propertyData.type} onChange={type => setPropertyData({ ...propertyData, type, isArray: false })} />

        {!['string', 'number', 'boolean', 'enum', 'script', 'Calculation'].includes(propertyData.type) && (
          <>
            {/* Check the type and see if it has a name property (arrays are required to have them) */}
            <Checkbox id='is-array' label='Is Array?' checked={propertyData.isArray} onChange={val => setPropertyData({ ...propertyData, isArray: val })} />
          </>
        )}

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
                    <div key={item} onClick={() => openModal('edit-option', ({ id }) => (
                      <EditStringModal id={id} data={item}
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
