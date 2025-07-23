import EditTypeModal from '@modals/EditType'
import React, { useState } from 'react'
import EditStringModal from '@modals/EditString'
import AccordionGroup from '@components/AccordionGroup'
import FloatingActionButton from '@components/FloatingActionButton'
import Button from '@components/inputs/Button'
import Accordion from '@components/Accordion'
import { addSystemType, addTypeProperty, deleteSystemType, deleteTypeProperty, renameSystemType, updateTypeProperty } from '@utils/system'

import { SystemType, type TypeData } from '@storage/schemas/system'
import { VersionedResource } from '@storage/schemas/versionedResource'
import storeMutation from '@storage/methods/versionedresources/storeMutation'
import { openModal } from '@state/modals'

type TypesProps = {
  editsId: string
  versionedResource: VersionedResource
}

const Types: React.FC<TypesProps> = ({ editsId, versionedResource }) => {
  const [openAccordion, setOpenAccordion] = useState(-1)

  return (
    <>      
      {/* TODO: Searchbar */}

      <AccordionGroup>
        {versionedResource.data.types.map((type: SystemType, i: number) => (
          <Accordion key={type.name} id={type.name} title={type.name} isOpen={openAccordion === i} toggleState={shouldOpen => setOpenAccordion(shouldOpen ? i : -1)}>
            <div>
              <Button color='light' onClick={() => openModal('edit-string', ({ id }) => (
                <EditStringModal id={id} data={type.name}
                  onSave={(data) => storeMutation(editsId, renameSystemType(versionedResource.data, type.name, data))}
                />
              ))}>Edit Name</Button>

              <Button color='light' onClick={async () => {
                let newProperty: {
                  key: string;
                  typeData: TypeData;
                } = {
                  key: 'newProperty',
                  typeData: {
                    type: 'string',
                    options: [],
                    isArray: false,
                    useTextArea: false,
                    inputs: [],
                    outputType: 'none',
                    isOutputAnArray: false
                  }
                }

                const newData = await addTypeProperty(versionedResource.data, type.name, newProperty)

                openModal('edit-type', ({ id }) => (
                  <EditTypeModal id={id} data={{ ...newProperty, typeName: type.name }}
                    onSave={(data) => storeMutation(editsId, updateTypeProperty(newData, type.name, newProperty.key, data))}
                    onDelete={() => storeMutation(editsId, deleteTypeProperty(newData, type.name, newProperty.key))}
                  />
                ))
              }}>Add Property</Button>

              <Button color='danger' onClick={() => storeMutation(editsId, deleteSystemType(versionedResource.data, type.name))}>Delete Type</Button>
            </div>

            <div className='flex flex-col gap-1 mt-3'>
              {
                type.properties.map((t) => (
                  <div key={t.key}
                    className='p-3 border border-neutral-600 dark:bg-neutral-800 hover:bg-neutral-700 cursor-pointer'
                    onClick={() => openModal('edit-type', ({ id }) => (
                        <EditTypeModal id={id} data={{ ...t, typeName: type.name }}
                          onSave={(data) => storeMutation(editsId, updateTypeProperty(versionedResource.data, type.name, t.key, data))}
                          onDelete={() => storeMutation(editsId, deleteTypeProperty(versionedResource.data, type.name, t.key))}
                        />
                      )
                    )}
                  >
                    <p>
                      {t.key} - {t.typeData.type} {t.typeData.isArray ? '(Array)' : ''} {t.typeData.options?.join(',')}
                    </p>
                  </div>
                ))
              }
            </div>
          </Accordion>
        ))}
      </AccordionGroup>

      <FloatingActionButton onClick={async () => {
        await storeMutation(editsId, addSystemType(versionedResource.data, 'New Type'))
        openModal('edit-string', ({ id }) => (
          <EditStringModal id={id} data='New Type'
            onSave={(data) => storeMutation(editsId, renameSystemType(versionedResource.data, 'New Type', data))}
          />
        ))
      }} />
    </>
  )
}

export default Types
