import { useNode } from '@craftjs/core'

function Divider() {
  const { connectors: { connect, drag } } = useNode()

  return (
    <div ref={ref => connect(drag(ref!))} style={{ height: 1, width: '100%', backgroundColor: 'white' }} />
  )
}

export function DividerPreview(props: any) {
  return (
    <div style={{ height: 1, width: '100%', backgroundColor: 'white' }} />
  )
}

function DividerSettings() {
  const { actions: { setProp }, } = useNode(node => ({}))

  return (
    <div>
      
    </div>
  )
}

Divider.craft = {
  rules: {
    canDrag: (node: any) => node.data.props.text !== 'Drag'
  },
  related: {
    settings: DividerSettings
  }
}

export default Divider