import { newRidgeState } from 'react-ridge-state'
import { SystemType } from '../types/system'

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
  modalState.set(
    (prevState) => [...prevState, { id: idCounter++, modal }],
  );
}

export function closeModal(id: number) {
  modalState.set(
    (prevState) => prevState.filter(modal => modal.id !== id),
  );
}