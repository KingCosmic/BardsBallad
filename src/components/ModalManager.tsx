import { modalState } from '@state/modals'

const ModalManager = () => {
  const modals = modalState.useValue()

  return modals.map(({ id, Component }) => <div key={id}><Component id={id} /></div>)
}

export default ModalManager
