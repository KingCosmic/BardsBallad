import { useCallback, useMemo } from 'react'
import { useReactFlow } from '@xyflow/react'

type NodeMenuProps = {
  id: string;
  top: string;
  left: string;
  right: string;
  bottom: string;
  onClick(): void;
}
 
export default function NodeContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  ...props
}: NodeMenuProps) {
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();
  const duplicateNode = useCallback(() => {
    const node = getNode(id)

    if (!node) return

    const position = {
      x: node.position.x + 50,
      y: node.position.y + 50,
    };
 
    addNodes({
      ...node,
      selected: false,
      dragging: false,
      id: `${node.id}-copy`,
      position,
    });
  }, [id, getNode, addNodes]);

  const nodeType = useMemo(() => getNode(id)?.type || '', [id, getNode])
 
  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [id, setNodes, setEdges]);
 
  return (
    <div
      style={{ position: 'absolute', top, left, right, bottom, zIndex: 9999 }}
      className='context-menu'
      {...props}
    >
      <div>
        <p>node: {id}</p>

        {
          (['entry', 'output'].includes(nodeType)) ? (
            <></>
          ) : (
            <>
              <p color='medium' onClick={duplicateNode}>duplicate</p>
              <p color='danger' onClick={deleteNode}>delete</p>
            </>
          )
        }
      </div>
    </div>
  );
}