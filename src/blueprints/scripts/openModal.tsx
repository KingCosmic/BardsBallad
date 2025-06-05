import { Node } from '@xyflow/react'
import BlueprintProcessor from '../../utils/Blueprints/processBlueprint'
import { closeModal, openModal } from '../../state/modals'
import { ReactNode } from 'react'
import EditObject from '../../modals/EditObject'
import EditNumberModal from '../../modals/EditNumber'
import EditStringModal from '../../modals/EditString'
import SystemModalRendererModal from '../../modals/SystemModalRenderer'

interface Modal {
  type: string;
  renderElement: (id: number, processor: BlueprintProcessor, title: string, data: any, save: (nd: any) => void, cancel: () => void) => ReactNode;
}

const supported_modals: Modal[] = [
  {
    type: 'edit_object',
    renderElement: (id, processor, title, data, save, cancel) => {
      const system = processor.getSystem()

      return (
        <EditObject title={title} data={data} types={system.types} isVisible={true} requestClose={() => closeModal(id)} onSave={save} onDelete={cancel} />
      )
    }
  },
  {
    type: 'edit_number',
    renderElement: (id, processor, title, data, save, cancel) => {

      return (
        <EditNumberModal id={id} title={title} data={data} onSave={save} />
      )
    }
  },
  {
    type: 'edit_string',
    renderElement: (id, processor, title, data, save, cancel) => {

      return (
        <EditStringModal id={id} title={title} data={data} onSave={save} />
      )
    }
  }
]

export default {
  process: (processor: BlueprintProcessor, node: Node) => {
    const data = processor.getParam(node.id, 'data')

    const system = processor.getSystem()

    const modals: Modal[] = [ ...supported_modals, ...system.modals.map(modal => ({
      type: modal.name,
      renderElement: (id: number, processor: BlueprintProcessor, title: string, data: any, save: (nd: any) => void, cancel: () => void) => {
        return (
          <SystemModalRendererModal id={id} state={{ ...processor.getState(), page: modal }} title={title} updateState={processor.callback} onSave={save} />
        )
      }
    })) ]

    openModal('blueprint-opened-modal', ({ id }) => modals.find(m => m.type === node.data.type)!.renderElement(id, processor, node.data.title as string, data, (newData: any) => {
      processor.setParam(node.id, 'newdata', newData)
      processor.processNodes(processor.getConnectingNodeForHandle(node, 'save', 'output'))
    }, () => {
      processor.processNodes(processor.getConnectingNodeForHandle(node, 'delete', 'output'))
    }))
  }
}