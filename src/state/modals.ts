import { newRidgeState } from 'react-ridge-state'
import { type SystemType } from '@storage/schemas/system'

type ModalData = {
  type: string;
  title: string;
  data: any;
  types?: SystemType[];
  onSave(value: any): void;
  onDelete?(): void;
}

type ModalInfo = {
  id: number;
  modal: ModalData;
}

let idCounter = 0;

export const modalState = newRidgeState<ModalInfo[]>([])

export function openModal(modal: ModalData) {
  const id = idCounter++;

  modalState.set(
    (prevState) => [...prevState, { id, modal }],
  );

  return id
}

export function closeModalByTitle(title: string) {
  modalState.set(
    (prevState) => prevState.filter(modal => modal.modal.title !== title),
  );
}

export function closeModal(id: number) {
  modalState.set(
    (prevState) => prevState.filter(modal => modal.id !== id),
  );
}
