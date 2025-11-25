import React, { useState } from 'react'
import { openModal } from '@state/modals'
import generateObject from '@utils/generateObject'
import Divider from '@components/Divider'
import EditObject from './EditObject'
import { type SystemType } from '@storage/schemas/system'
import Button from '@components/inputs/Button'

type Props = {
  title: string
  data: any[]
  type: SystemType
  types: SystemType[]
  onAdd(newItem: any): void
  onChange(path: string, value: any): void
  onDelete(itemName: string): void
}

export default function ArrayEdit({ title, data, type, types, onAdd, onChange, onDelete }: Props) {

  return (
    <div key={title} className='mt-3'>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <p>{title} <span className='text-sm text-neutral-500'>({data.length})</span></p>

        <Button color='primary' onClick={() => onAdd(generateObject(types, type))}>Add</Button>
      </div>

      <Divider />

      <div className='flex flex-col gap-1 mt-3'>
        {data.map(item => (
          <div key={item.name}
            className='p-3 border border-neutral-600 dark:bg-neutral-800 hover:bg-neutral-700 cursor-pointer'
            onClick={() => openModal('edit-object', ({ id }) => (
              <EditObject
                id={id}
                title={`Edit ${item.name}`}
                types={types}
                onDelete={() => onDelete(item.name)}
                onSave={(newItem) => {
                  const newItems = [ ...data ]

                  const index = newItems.findIndex(v => v.name === item.name)

                  newItems[index] = newItem

                  onChange(`${title}`, newItems)
                }}
                
                data={item}
              />
            ))}
          >
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
