import { useEffect } from 'react'
import { useEditor } from '../context/EditorContext'
import { refrainSelectionState, setUpdatePropsCallback } from '../state/selectionStore'

/**
 * Renders null — exists only to sync the EditorContext selection into the
 * global refrainSelectionState so that out-of-tree components (e.g. the
 * sidebar) can read and update the selected block's props.
 *
 * Must be rendered inside both BlockRegistryProvider and EditorProvider.
 */
export const EditorBridge: React.FC = () => {
  const { selectedBlock, updateBlockProps } = useEditor()

  useEffect(() => {
    setUpdatePropsCallback(
      selectedBlock
        ? (props) => updateBlockProps(selectedBlock.id, props)
        : null
    )
  }, [selectedBlock, updateBlockProps])

  useEffect(() => {
    if (!selectedBlock) {
      refrainSelectionState.set({ selectedId: null, selectedType: null, selectedProps: {} })
    } else {
      refrainSelectionState.set({
        selectedId: selectedBlock.id,
        selectedType: selectedBlock.type,
        selectedProps: selectedBlock.props,
      })
    }
  }, [selectedBlock])

  return null
}
