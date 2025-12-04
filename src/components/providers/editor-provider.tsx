import { Editor as EditorContext, SerializedNodes } from '@craftjs/core'
import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

import Container from '@/components/designer/components/Container/Editor'
import EditorSelect from '@/components/designer/components/Select/Editor'
import FAB from '@/components/designer/FloatingActionButton'
import Text from '@/components/designer/components/Text/Editor'
import Input from '@/components/designer/components/Input/Editor'
import Separator from '@/components/designer/components/Divider'

type NodeChangeHandler = (query: { serialize: () => SerializedNodes }) => void

interface EditorProviderContextType {
  setOnNodeChange: (handler: NodeChangeHandler | null) => void
}

const EditorProviderContext = createContext<EditorProviderContextType | null>(null)

/**
 * Hook to access the EditorProvider context
 * 
 * Use this hook to set a callback for handling node changes in CraftJS.
 * This allows components deep in the tree to register their own handlers
 * that have access to local state/props.
 * 
 * @example
 * ```tsx
 * const { setOnNodeChange } = useEditorProvider()
 * 
 * useEffect(() => {
 *   setOnNodeChange((query) => {
 *     const serialized = JSON.stringify(query.serialize())
 *     // Do something with serialized data
 *   })
 * 
 *   return () => setOnNodeChange(null) // Clean up
 * }, [dependencies])
 * ```
 */

export const useEditorProvider = () => {
  const context = useContext(EditorProviderContext)
  if (!context) {
    throw new Error('useEditorProvider must be used within EditorProvider')
  }
  return context
}

const resolver = {
  Container, 
  Text, 
  Select: EditorSelect, 
  TextInput: Input, 
  FAB, 
  DesignerDivider: Separator
}

interface EditorProviderProps {
  children: ReactNode
}

export function EditorProvider({ children }: EditorProviderProps) {
  const [onNodeChangeHandler, setOnNodeChangeHandler] = useState<NodeChangeHandler | null>(null)

  const handleNodeChange = useCallback((query: any) => {
    if (onNodeChangeHandler) {
      onNodeChangeHandler(query)
    }
  }, [onNodeChangeHandler])

  const setOnNodeChange = useCallback((handler: NodeChangeHandler | null) => {
    setOnNodeChangeHandler(() => handler)
  }, [])

  return (
    <EditorProviderContext.Provider value={{ setOnNodeChange }}>
      <EditorContext resolver={resolver} onNodesChange={handleNodeChange}>
        {children}
      </EditorContext>
    </EditorProviderContext.Provider>
  )
}
