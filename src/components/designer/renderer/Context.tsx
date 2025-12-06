import { createContext, ReactElement, useContext } from 'react'

export type LocalData = {
  [key:string]: any
}

const LocalDataContext = createContext<LocalData>({})

// Hook to get local data
export function useLocalData() {
  return useContext(LocalDataContext)
}

interface AddDataProps {
  localData: LocalData;
  children: ReactElement;
}

export const AddData = ({ localData, children }: AddDataProps) => {
  const parentData = useLocalData()

  return (
    <LocalDataContext.Provider value={{ ...parentData, ...localData }}>
      {children}
    </LocalDataContext.Provider>
  )
}