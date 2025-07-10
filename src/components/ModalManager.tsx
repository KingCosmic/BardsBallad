import { modalState } from '@state/modals'

const ModalManager = () => {
  const modals = modalState.useValue()

  return (
    <div style={{ zIndex: 9999 }}>
      {modals.map(({ id, Component }) => <Component id={id} key={id} />)}
    </div>
  )
}

export default ModalManager
