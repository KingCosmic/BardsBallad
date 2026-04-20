import React, { createContext, useContext, useMemo } from 'react'

const LocalDataContext = createContext<Record<string, any>>({})

export const useLocalData = (): Record<string, any> => useContext(LocalDataContext)

export const LocalDataProvider: React.FC<{
  data: Record<string, any>
  children: React.ReactNode
}> = ({ data, children }) => {
  const parent = useLocalData()
  const merged = useMemo(() => ({ ...parent, ...data }), [parent, data])
  return <LocalDataContext.Provider value={merged}>{children}</LocalDataContext.Provider>
}
