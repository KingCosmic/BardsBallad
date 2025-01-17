import { useEditor } from '@craftjs/core'

/**
 * Recursively loop over our parent nodes and check for any state inside of a "local" property.
 * Then read said props and return them in one object.
 */
export function useLocalState(id: string) {
  const { query } = useEditor()

  return getStateRecursive(query, id)
}

function getStateRecursive(query: any, id: string): any {
  const node = query.node(id).get()

  if (!node.data.parent) return []

  const parent = query.node(node.data.parent).get()

  // TODO: we need to combine these arrays while removing duplicate name entries.

  return [ ...(parent.data.props.local || []), ...getStateRecursive(query, parent.id) ]
}