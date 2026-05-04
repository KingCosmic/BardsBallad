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
let _activeBridgeId: string | null = null

export const setUpdatePropsCallback = (fn: ((props: Record<string, any>) => void) | null) => {
  _updatePropsCallback = fn
}

export const setBridgeSelection = (
  bridgeId: string,
  nextSelection: RefrainSelectionState,
  nextCallback: ((props: Record<string, any>) => void) | null
) => {
  const current = refrainSelectionState.get()

  _activeBridgeId = bridgeId

  if (
    current.selectedId !== nextSelection.selectedId
    || current.selectedType !== nextSelection.selectedType
    || current.selectedProps !== nextSelection.selectedProps
  ) {
    refrainSelectionState.set(nextSelection)
  }

  _updatePropsCallback = nextCallback
}

export const releaseBridgeSelection = (
  bridgeId: string,
  options?: { clearState?: boolean; clearCallback?: boolean }
) => {
  if (_activeBridgeId !== bridgeId) return

  _activeBridgeId = null

  if (options?.clearState) {
    refrainSelectionState.set({ selectedId: null, selectedType: null, selectedProps: {} })
  }

  if (options?.clearCallback) {
    _updatePropsCallback = null
  }
}

export const updateRefrainSelectedProps = (props: Record<string, any>) => {
  const current = refrainSelectionState.get()
  if (current.selectedProps === props) return

  refrainSelectionState.set((prev) => ({
    ...prev,
    selectedProps: props,
  }))

  _updatePropsCallback?.(props)
}
