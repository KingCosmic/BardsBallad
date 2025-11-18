import { newRidgeState } from 'react-ridge-state'

type ModalInfo = {
  id: number;
  tag: string;
  Component: React.FC<{ id: number }>;
}

type Callback = ({ action, value, wasDismissed }: {
  action: string,
  value: any,
  wasDismissed: boolean
}) => void

interface ModalState {
  modals: ModalInfo[]
  pendingCallbacks: Map<number, Callback>
}

let idCounter = 0;

export const modalState = newRidgeState<ModalState>({
  modals: [],
  pendingCallbacks: new Map()
})

export function openModal(tag: string, Component: React.FC<{ id: number }>) {
  const id = idCounter++;

  modalState.set(
    (prevState) => ({
      modals: [...prevState.modals, { id, tag, Component }],
      pendingCallbacks: prevState.pendingCallbacks
    }),
  );

  return id
}

export function closeModal(id: number) {
  modalState.set(
    (prevState) => {
      const closedModals: number[] = []
      const filteredList = prevState.modals.filter(modal => {
        if (modal.id === id) {
          closedModals.push(modal.id)
          return false
        } else {
          return true
        }
      })

      closedModals.forEach(id => {
        const cb = prevState.pendingCallbacks.get(id)

        if (cb) cb({ action: 'closed', value: null, wasDismissed: false })

        prevState.pendingCallbacks.delete(id)
      })

      return ({
        modals: filteredList,
        pendingCallbacks: prevState.pendingCallbacks,
      })
    }
  );
}

export function closeModalByTag(tag: string) {
  modalState.set(
    (prevState) => {
      const closedModals: number[] = []
      const filteredList = prevState.modals.filter(modal => {
        if (modal.tag === tag) {
          closedModals.push(modal.id)
          return false
        } else {
          return true
        }
      })

      closedModals.forEach(id => {
        const cb = prevState.pendingCallbacks.get(id)

        if (cb) cb({ action: 'closed', value: null, wasDismissed: false })

        prevState.pendingCallbacks.delete(id)
      })

      return ({
        modals: filteredList,
        pendingCallbacks: prevState.pendingCallbacks,
      })
    }
  );
}

export function registerCallback(modalId: number, callback: Callback) {
  const state = modalState.get()

  state.pendingCallbacks.set(modalId, callback)
}

export function handleCallback(modalId: number, action: string, value: any) {
  const state = modalState.get()

  const cb = state.pendingCallbacks.get(modalId)

  if (cb) cb({ action, value, wasDismissed: false })

  state.pendingCallbacks.delete(modalId)
}
