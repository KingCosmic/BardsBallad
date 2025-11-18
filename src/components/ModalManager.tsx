import { modalState } from '@state/modals'

const ModalManager = () => {
  const state = modalState.useValue()

  return (
    <div style={{ zIndex: 9999 }}>
      {state.modals.map(({ id, Component }) => <Component id={id} key={id} />)}
    </div>
  )
}

export default ModalManager
