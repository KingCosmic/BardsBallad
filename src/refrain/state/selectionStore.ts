import { newRidgeState } from 'react-ridge-state'

export type RefrainSelectionState = {
  selectedId: string | null
  selectedType: string | null
  selectedProps: Record<string, any>
}

export const refrainSelectionState = newRidgeState<RefrainSelectionState>({
  selectedId: null,
  selectedType: null,
  selectedProps: {},
})

// Module-level write-back ref — set from inside the EditorProvider tree,
// called from outside it (e.g. the sidebar).
let _updatePropsCallback: ((props: Record<string, any>) => void) | null = null

export const setUpdatePropsCallback = (fn: ((props: Record<string, any>) => void) | null) => {
  _updatePropsCallback = fn
}

export const updateRefrainSelectedProps = (props: Record<string, any>) => {
  _updatePropsCallback?.(props)
}
