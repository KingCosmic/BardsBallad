import React, { createContext, useContext } from 'react'

type ViewerContextValue = {
  state: any
  updateState: (changes: any) => void
}

const ViewerContext = createContext<ViewerContextValue>({
  state: {},
  updateState: () => {},
})

export const useViewerState = (): ViewerContextValue => useContext(ViewerContext)

export const ViewerProvider: React.FC<{
  state: any
  updateState: (changes: any) => void
  children: React.ReactNode
}> = ({ state, updateState, children }) => {
  return (
    <ViewerContext.Provider value={{ state, updateState }}>
      {children}
    </ViewerContext.Provider>
  )
}
