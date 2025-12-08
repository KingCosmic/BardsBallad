import React from 'react';
import { useEditor } from '@craftjs/core';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  ChevronRight, 
  ChevronDown,
} from 'lucide-react'

const LayersPanel = () => {
  const { nodes, actions, isActive } = useEditor((state) => ({
    nodes: state.nodes,
    isActive: state.events.selected
  }));

  const [expandedNodes, setExpandedNodes] = React.useState<{ [key:string]: any }>({});
  const [hoveredNode, setHoveredNode] = React.useState('');

  const { connectors: { select } } = useEditor();

  const toggleExpanded = (nodeId: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const renderNode = (nodeId: string) => {
    const node = nodes[nodeId]
    if (!node) return null

    const isExpanded = expandedNodes[nodeId];
    const hasChildren = node.data.nodes && node.data.nodes.length > 0;

    const isSelected = isActive.has(nodeId)

    return (
      <div key={nodeId} className='select-none'>
        <div
          // @ts-ignore
          ref={ref => select(ref, nodeId)}
          className={`
            flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors duration-200 hover:bg-secondary/80
            ${isSelected ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300' : ''}
            ${hoveredNode === nodeId && !isSelected ? 'bg-secondary/50' : ''}
          `}
          onMouseEnter={() => setHoveredNode(nodeId)}
          onMouseLeave={() => setHoveredNode('')}
        >
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(nodeId);
              }}
              className='w-4 h-4 flex items-center justify-center hover:bg-secondary/80 rounded'
            >
              {isExpanded ? (
                <ChevronDown className='w-4 h-4' />
              ) : (
                <ChevronRight className='w-4 h-4' />
              )}
            </button>
          ) : (
            <div className='w-4' />
          )}
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              actions.setHidden(nodeId, !node.data.hidden);
            }}
            className='text-foreground/80 hover:text-foreground'
          >
            {node.data.hidden ? (
              <EyeOff className='w-4 h-4' />
            ) : (
              <Eye className='w-4 h-4' />
            )}
          </button>
          
          <span className='text-sm font-medium'>
            {node.data.custom?.displayName || node.data.displayName || node.data.name}
          </span>
        </div>

        {hasChildren && isExpanded && (
          <div className='ml-1.5 border-l border-border/50 pl-2 mt-1'>
            {node.data.nodes.map(childId => renderNode(childId))}
          </div>
        )}
      </div>
    );
  };

  const rootNodes = Object.keys(nodes).filter(id => !nodes[id].data.parent);

  return (
    <div className='p-4 space-y-2'>
      <div className='text-sm font-medium flex items-center gap-2 px-2'>
        <Layers className='w-4 h-4' />
        Layers
      </div>
      <div className='space-y-1'>
        {rootNodes.map(rootNodeId => renderNode(rootNodeId))}
      </div>
    </div>
  )
}

export default LayersPanel;