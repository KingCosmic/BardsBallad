import { modalState, closeModal } from '../state/modals'

import EditObjectModal from '../modals/EditObjectModal'

const ModalManager = () => {
  const modals = modalState.useValue()

  return (
    <>
      {
        modals.map(({ id, data }) => {
          return (
            <EditObjectModal
              key={id}
              title={data.title}
              data={data.objData}
              isVisible={true}
              requestClose={() => closeModal(id)}
              onSave={data.onSave}
              onDelete={data.onDelete}
            />
          )
        })
      }
    </>
  )
}

export default ModalManager