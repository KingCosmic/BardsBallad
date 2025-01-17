import { newRidgeState } from 'react-ridge-state'

type EditorState = {
  page: string;
  tab: string;
}

const defaultState: EditorState = {
  page: 'Info',
  tab: 'character'
}

export const editorState = newRidgeState<EditorState>(defaultState)

export function resetEditor() {
  editorState.set(defaultState)
}

export function setPage(page: string) {
  editorState.set((prev) => ({ ...prev, page }))
}

export function setTab(tab: string) {
  editorState.set((prev) => ({ ...prev, tab }))
}