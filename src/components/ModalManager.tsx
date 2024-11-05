import { modalState, closeModal } from '../state/modals'

import EditObjectModal from '../modals/EditObjectModal'
import BlueprintEditor from '../modals/BlueprintEditor'

const ModalManager = () => {
  const modals = modalState.useValue()

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
          ) : (
            <EditObjectModal
              key={id}
              title={modal.title}
              data={modal.data}
              isVisible={true}
              requestClose={() => closeModal(id)}
              onSave={modal.onSave}
              onDelete={modal.onDelete}
            />
          )
        })
      }
    </>
  )
}

export default ModalManager