import React from 'react'
import { Handle, Position, useHandleConnections } from '@xyflow/react'

const maxConnections = 1

interface HandleProps {
  name: string
  type: string
  handleType: 'source' | 'target'
  position: Position
  style: React.CSSProperties
}

const CustomHandle = (props: HandleProps) => {
  const connections = useHandleConnections({
    type: props.handleType
  })

  return (
    <Handle
      id={`${props.name}-${props.type}`}
      type={props.handleType}
      position={props.position}
      style={props.style}
      isConnectable={connections.length < maxConnections}
    />
  )
}

export default CustomHandle