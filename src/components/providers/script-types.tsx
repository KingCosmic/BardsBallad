import { SystemType } from '@/db/system/schema';
import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from 'react'

const TypesContext = createContext<{
  types: SystemType[]
  setScriptTypes: Dispatch<SetStateAction<SystemType[]>>
}>({ types: [], setScriptTypes: () => {} })

export function ScriptTypesProvider({ children }: PropsWithChildren) {
  const [value, setValue] = useState<SystemType[]>([]);
  
  return (
    <TypesContext.Provider value={{ types: value, setScriptTypes: setValue }}>
      {children}
    </TypesContext.Provider>
  );
}

export function useScriptTypes() {
  const context = useContext(TypesContext)
  if (!context) {
    throw new Error('useTypes must be used within TypesContextProvider')
  }
  return context
}