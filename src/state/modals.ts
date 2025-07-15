import { newRidgeState } from 'react-ridge-state'

type ModalInfo = {
  id: number;
  tag: string;
  Component: React.FC<{ id: number }>;
}

let idCounter = 0;

export const modalState = newRidgeState<ModalInfo[]>([])

export function openModal(tag: string, Component: React.FC<{ id: number }>) {
  const id = idCounter++;

  modalState.set(
    (prevState) => [...prevState, { id, tag, Component }],
  );

  return id
}

export function closeModal(id: number) {
  modalState.set(
    (prevState) => prevState.filter(modal => modal.id !== id),
  );
}

export function closeModalByTag(tag: string) {
  modalState.set(
    (prevState) => prevState.filter(modal => modal.tag !== tag),
  );
}
