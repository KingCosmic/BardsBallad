import { newRidgeState } from 'react-ridge-state'

type EditorState = {
  page: string;
}

const defaultState: EditorState = {
  page: 'Info'
}

export const characterEditorState = newRidgeState<EditorState>(defaultState)

export function resetEditor() {
  characterEditorState.set(defaultState)
}

export function setPage(page: string) {
  characterEditorState.set((prev) => ({ ...prev, page }))
}