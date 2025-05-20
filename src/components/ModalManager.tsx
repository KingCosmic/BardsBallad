import { modalState, closeModal } from '../state/modals'

import BlueprintEditor from '../modals/BlueprintEditor'
import EditObject from '../modals/EditObject'
import EditBlueprintParamModal from '../modals/EditBlueprintParam'
import EditStringModal from '../modals/EditString'
import EditNumberModal from '../modals/EditNumber'
import ConfirmModal from '../modals/ConfirmModal'
import HandleConflicts from '../modals/HandleConflicts'
import AuthModal from '../modals/Auth'
import ImportFile from '../modals/ImportFile'
import MarketplaceViewModal from '../modals/MarketplaceView'
import MarketplaceDisclaimer from '../modals/MarketplaceDisclaimer'
import SaveNewVersion from '../modals/SaveNewVersion'
import PublishItem from '../modals/PublishItem'
import WelcomeMessage from '../modals/WelcomeMessage'

// TODO: completely rework this, make it to where you provide the modal component when calling addModal

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
          ) : (modal.type === 'onboarding') ? (
            <WelcomeMessage
              key={id}
              data={modal.data}
              title={modal.title}
              isOpen={true}
              requestClose={() => closeModal(id)}
              onSave={modal.onSave}
              onDelete={modal.onDelete}
            />
          ) : (modal.type === 'PublishItem') ? (
            <PublishItem
              key={id}
              data={modal.data}
              isOpen={true}
              requestClose={() => closeModal(id)}
              onSave={modal.onSave}
            />
          ) : (modal.type === 'SaveNewVersion') ? (
            <SaveNewVersion
              key={id}
              data={modal.data}
              isOpen={true}
              requestClose={() => closeModal(id)}
              onSave={modal.onSave}
            />
          ) : (modal.type === 'HandleConflicts') ? (
            <HandleConflicts
              key={id}
              data={modal.data}
              isOpen={true}
              requestClose={() => closeModal(id)}
              onSave={modal.onSave}
            />
          ) : (modal.type === 'marketplace_view') ? (
            <MarketplaceViewModal
              key={id}
              data={modal.data}
              title={modal.title}
              isOpen={true}
              requestClose={() => closeModal(id)}
              onSave={modal.onSave}
            />
          ) : (modal.type === 'authentication') ? (
            <AuthModal
              key={id}
              isOpen={true}
              requestClose={() => closeModal(id)}
            />
          ) : (modal.type === 'import_file') ? (
            <ImportFile
              key={id}
              title={modal.title}
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
          ) : (modal.type === 'marketplace_disclaimer') ? (
            <MarketplaceDisclaimer
              key={id}
              isOpen={true}
              requestClose={() => closeModal(id)}
              onAccept={modal.onSave}
            />
          ) : <h1 key={id}>{modal.type} is un supported.</h1>
        })
      }
    </>
  )
}

export default ModalManager