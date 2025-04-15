import { modalState, closeModal } from '../state/modals'

import BlueprintEditor from '../modals/BlueprintEditor'
import EditObject from '../modals/EditObject'
import EditBlueprintParamModal from '../modals/EditBlueprintParam'
import EditStringModal from '../modals/EditString'
import EditNumberModal from '../modals/EditNumber'
import ConfirmModal from '../modals/ConfirmModal'
import HandleConflicts from '../modals/HandleConflicts'

// TODO: I'm not sure how we'll grab the types since we're not using the system state anymore.

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
          ) : (modal.type === 'HandleConflicts') ? (
            <HandleConflicts
              key={id}
              data={modal.data}
              isOpen={true}
              requestClose={() => closeModal(id)}
              onSave={modal.onSave}
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
              types={modal.types!}
            />
          ) : (modal.type === 'edit_blueprint_param') ? (
            <EditBlueprintParamModal
              key={id}
              data={modal.data}
              isOpen={true}
              requestClose={() => closeModal(id)}
              onSave={modal.onSave}
              onDelete={modal.onDelete}
            />
          ) : (modal.type === 'edit_string') ? (
            <EditStringModal
              key={id}
              title={modal.title}
              data={modal.data}
              isOpen={true}
              requestClose={() => closeModal(id)}
              onSave={modal.onSave}
              onDelete={modal.onDelete}
            />
          ) : (modal.type === 'edit_number') ? (
            <EditNumberModal
              key={id}
              title={modal.title}
              data={modal.data}
              isOpen={true}
              requestClose={() => closeModal(id)}
              onSave={modal.onSave}
              onDelete={modal.onDelete}
            />
          ) : (modal.type === 'confirm') ? (
            <ConfirmModal
              key={id}
              title={modal.title}
              data={modal.data}
              isOpen={true}
              requestClose={() => closeModal(id)}
              onConfirm={modal.onSave}
            />
          ) : <h1>{modal.type} is un supported.</h1>
        })
      }
    </>
  )
}

export default ModalManager