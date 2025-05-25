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

type TypesProps = {
  editsId: string
  versionedResource: VersionedResource
}

const Types: React.FC<TypesProps> = ({ editsId, versionedResource }) => {
  const [editData, setEditData] = useState<{
    key: string;
    typeData: TypeData;
    typeName: string;
  } | null>(null)

  const [editName, setEditName] = useState<string | null>(null)

  const [openAccordion, setOpenAccordion] = useState(-1)

  return (
    <>
      <EditTypeModal data={editData} isOpen={editData !== null}
        requestClose={() => setEditData(null)}
        onSave={(data) => storeMutation(editsId, updateTypeProperty(versionedResource.data, editData?.typeName || '', editData?.key || '', data))}
        onDelete={() => storeMutation(editsId, deleteTypeProperty(versionedResource.data, editData?.typeName || '', editData?.key || ''))}
      />

      <EditStringModal data={editName} isOpen={editName !== null}
        requestClose={() => setEditName(null)}
        onSave={(data) => storeMutation(editsId, renameSystemType(versionedResource.data, editName || '', data))}
      />
      
      {/* TODO: Searchbar */}

      <AccordionGroup>
        {versionedResource.data.types.map((type: SystemType, i: number) => (
          <Accordion key={type.name} id={type.name} title={type.name} isOpen={openAccordion === i} toggleState={shouldOpen => setOpenAccordion(shouldOpen ? i : -1)}>
            <div>
              <Button color='light' onClick={() => setEditName(type.name)}>Edit Name</Button>

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

                await storeMutation(editsId, addTypeProperty(versionedResource.data, type.name, newProperty))

                setEditData({ ...newProperty, typeName: type.name })
              }}>Add Property</Button>

              <Button color='danger' onClick={() => storeMutation(editsId, deleteSystemType(versionedResource.data, type.name))}>Delete Type</Button>
            </div>

            <div className='flex flex-col gap-1 mt-3'>
              {
                type.properties.map((t) => (
                  <div key={t.key}
                    className='p-3 border border-neutral-600 dark:bg-neutral-800 hover:bg-neutral-700 cursor-pointer'
                    onClick={() => setEditData({ ...t, typeName: type.name })}
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
        setEditName('New Type')
      }} />
    </>
  )
}

export default Types
