import { modalState, closeModal } from '../state/modals'

import BlueprintEditor from '../modals/BlueprintEditor'
import EditObject from '../modals/EditObject'
import { systemState } from '../state/system'
import { characterState } from '../state/character'

const ModalManager = () => {
  const modals = modalState.useValue()
  const system = systemState.useValue()
  const character = characterState.useValue()

  return (
    <>
      {
        modals.map(({ id, modal }) => {
          return (modal.type === 'blueprint') ? (
            <BlueprintEditor
              key={id}
              title={modal.title}
              data={modal.data}
              isVisible={true}
              requestClose={() => closeModal(id)}
              onSave={modal.onSave}
              onDelete={modal.onDelete}
            />
          ) : (modal.type === 'edit_object') ? (
            <EditObject
              key={id}
              title={modal.title}
              data={modal.data}
              isVisible={true}
              requestClose={() => closeModal(id)}
              onSave={modal.onSave}
              onDelete={modal.onDelete}
              types={system?.types || character?.system.types || []}
            />
          ) : <h1>{modal.type} is un supported.</h1>
        })
      }
    </>
  )
}

export default ModalManager