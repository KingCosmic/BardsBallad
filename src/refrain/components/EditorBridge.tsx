import { useEffect, useRef } from 'react'
import { useEditor } from '../context/EditorContext'
import { releaseBridgeSelection, setBridgeSelection } from '../state/selectionStore'

/**
 * Renders null — exists only to sync the EditorContext selection into the
 * global refrainSelectionState so that out-of-tree components (e.g. the
 * sidebar) can read and update the selected block's props.
 *
 * Must be rendered inside both BlockRegistryProvider and EditorProvider.
 */
export const EditorBridge: React.FC<{ suppressClear?: boolean }> = ({ suppressClear = false }) => {
  const { selectedBlock, updateBlockProps } = useEditor()
  const bridgeIdRef = useRef(`bridge-${Math.random().toString(36).slice(2)}`)
  const bridgeId = bridgeIdRef.current

  useEffect(() => {
    if (selectedBlock) {
      setBridgeSelection(
        bridgeId,
        {
        selectedId: selectedBlock.id,
        selectedType: selectedBlock.type,
        selectedProps: selectedBlock.props,
        },
        (props) => updateBlockProps(selectedBlock.id, props)
      )
      return
    }

    releaseBridgeSelection(bridgeId, {
      clearState: !suppressClear,
      clearCallback: !suppressClear,
    })
  }, [selectedBlock, updateBlockProps, suppressClear, bridgeId])

  useEffect(() => {
    return () => {
      releaseBridgeSelection(bridgeId, {
        clearState: !suppressClear,
        clearCallback: !suppressClear,
      })
    }
  }, [bridgeId, suppressClear])

  return null
}
