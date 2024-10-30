import { newRidgeState } from 'react-ridge-state'

type ModalData = {
  title: string;
  objData: any;
  onSave(value: any): void;
  onDelete?(): void;
}

type ModalInfo = {
  id: number;
  data: ModalData;
}

let idCounter = 0;

export const modalState = newRidgeState<ModalInfo[]>([])

export function openModal(data: ModalData) {
  modalState.set(
    (prevState) => [...prevState, { id: idCounter++, data }],
  );
}

export function closeModal(id: number) {
  modalState.set(
    (prevState) => prevState.filter(modal => modal.id !== id),
  );
}