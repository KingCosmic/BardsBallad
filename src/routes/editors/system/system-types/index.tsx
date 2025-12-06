import { Accordion, AccordionContent, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import FloatingActionButton from '@/components/ui/fab'
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
import addSystemType from '@/db/system/methods/addSystemType'
import addTypeProperty from '@/db/system/methods/addTypeProperty'
import deleteSystemType from '@/db/system/methods/deleteSystemType'
import deleteTypeProperty from '@/db/system/methods/deleteTypeProperty'
import renameSystemType from '@/db/system/methods/renameSystemType'
import updateTypeProperty from '@/db/system/methods/updateTypeProperty'
import { SystemData, TypeData } from '@/db/system/schema'
import storeMutation from '@/db/version/methods/storeMutation'
import { VersionedResource } from '@/db/version/schema'
import EditString from '@/modals/editors/edit-string'
import EditType from '@/modals/editors/edit-type'
import { openModal } from '@/state/modals'
import { AccordionItem } from '@radix-ui/react-accordion'
import React from 'react'

interface Props {
  editsId: string
  versionedResource: VersionedResource
}

const SystemTypes: React.FC<Props> = ({ editsId, versionedResource }) => {

  return (
    <>
      {/* TODO: Searchbar */}
      <Accordion
        type='multiple'
        className='w-full'
      >
        {(versionedResource.data as SystemData).types.map(type => (
          <AccordionItem key={type.name} value={type.name}>
            <AccordionTrigger>{type.name}</AccordionTrigger>
            <AccordionContent>
              <div className='flex gap-2'>
                <Button variant='outline' onClick={() => openModal('edit-string', ({ id }) => (
                  <EditString id={id} data={type.name}
                    onSave={(data) => storeMutation(editsId, renameSystemType(versionedResource.data as any, type.name, data))}
                  />
                ))}>Edit Name</Button>

                <Button variant='outline' onClick={async () => {
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

                  const newData = await addTypeProperty(versionedResource.data as any, type.name, newProperty)

                  openModal('edit-type', ({ id }) => (
                    <EditType id={id} data={{ ...newProperty, typeName: type.name }}
                      onSave={(data) => storeMutation(editsId, updateTypeProperty(newData, type.name, newProperty.key, data))}
                      onDelete={() => storeMutation(editsId, deleteTypeProperty(newData, type.name, newProperty.key))}
                    />
                  ))
                }}>Add Property</Button>

                <Button variant='destructive' onClick={() => storeMutation(editsId, deleteSystemType(versionedResource.data as any, type.name))}>Delete Type</Button>
              </div>

              <div className='flex flex-col gap-1 mt-3'>
                {type.properties.map(t => (
                  <Item key={t.key} variant='muted'>
                    <ItemContent>
                      <ItemTitle>{t.key}</ItemTitle>
                      <ItemDescription>
                        {t.typeData.type} {t.typeData.isArray ? '(Array)' : ''} {t.typeData.options?.join(',')}
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Button variant='outline' size='sm' onClick={() =>
                        openModal('edit-type', ({ id }) => (
                          <EditType id={id} data={{ ...t, typeName: type.name }}
                            onSave={(data) => storeMutation(editsId, updateTypeProperty(versionedResource.data as any, type.name, t.key, data))}
                            onDelete={() => storeMutation(editsId, deleteTypeProperty(versionedResource.data as any, type.name, t.key))}
                          />
                        )
                      )}>
                        Edit
                      </Button>
                    </ItemActions>
                  </Item>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <FloatingActionButton onClick={async () => {
        const newData = await addSystemType(versionedResource.data as any, 'New Type')
        openModal('edit-string', ({ id }) => (
          <EditString id={id} data='New Type'
            onSave={(data) => storeMutation(editsId, renameSystemType(newData, 'New Type', data))}
          />
        ))
      }} />
    </>
  )
}

export default SystemTypes