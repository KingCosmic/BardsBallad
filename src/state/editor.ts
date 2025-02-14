import { newRidgeState } from 'react-ridge-state'

export type EditorState = {
  characterPage: string;
  modalsPage: string;
  creatorPage: string;
  tab: string;
}

const defaultState: EditorState = {
  characterPage: 'Info',
  modalsPage: 'Start',
  creatorPage: 'Start',
  tab: 'character',
}

export const editorState = newRidgeState<EditorState>(defaultState)

export function resetEditor() {
  editorState.set(defaultState)
}

export function setCreatorPage(creatorPage: string) {
  editorState.set((prev) => ({ ...prev, creatorPage }))
}

export function setCharacterPage(characterPage: string) {
  editorState.set((prev) => ({ ...prev, characterPage }))
}

export function setTab(tab: string) {
  editorState.set((prev) => ({ ...prev, tab }))
}