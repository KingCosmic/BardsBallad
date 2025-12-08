import { useScriptTypes } from '@/components/providers/script-types';
import EditObject from '@/modals/editors/edit-object';
import { handleCallback, openModal, registerCallback } from '@/state/modals';
import { ReactNode } from 'react'

interface ModalResponse {
  action: string,
  value: any,
  wasDismissed: boolean
}

export default (type: string, title: string, value: any): Promise<ModalResponse> => {

  let Comp: ({ id }: { id: number }) => ReactNode
  switch (type) {
    case 'edit_object':
      Comp = ({ id }) => {
        const { types } = useScriptTypes();

        return (
          <EditObject types={types} id={id} title={title} data={value}
            onDelete={() => handleCallback(id, 'delete', null)}
            onSave={(newObject) => handleCallback(id, 'save', newObject)}
          />
        )
      };
      break;
    // case 'edit_number':
    //   Comp = ({ id }) => <EditNumberModal id={id} title={title} data={value}
    //     onSave={(newNumber) => handleCallback(id, 'save', +newNumber)}
    //   />
    //   break;
    // case 'edit_string':
    //   Comp = ({ id }) => <EditStringModal id={id} title={title} data={value}
    //     onDelete={() => handleCallback(id, 'delete', null)}
    //     onSave={(newString) => handleCallback(id, 'save', newString)}
    //   />
    //   break;
  }

  return new Promise((resolve) => {
    const id = openModal(type, Comp)
    registerCallback(id, resolve)
  })
}