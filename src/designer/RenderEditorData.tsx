import ContainerPreview from './components/Container/Preview'
import TextPreview from './components/Text/Preview'
import { DividerPreview as Divider } from './components/Divider'

import { AddData } from './renderer/Context'
import { FABPreview } from './FloatingActionButton'

const RenderEditorData = ({ data, style }: any) => {
  // TODO: process page blueprint.

  return (
    <div style={style}>
      <AddData localData={[]}>
        <NodeRenderer node={data.ROOT} data={data} />
      </AddData>
    </div>
  )
}

const NodeRenderer = ({ node, data }: any) => {
  const type = (typeof node.type === 'object') ? node.type.resolvedName : node.type

  const Children = node.nodes.map((id: string) => <NodeRenderer key={id} node={data[id]} data={data} />)

  switch (type) {
    case 'Container':
      return <ContainerPreview {...node.props}>{Children}</ContainerPreview>
    case 'Text':
      return <TextPreview {...node.props} />
    case 'DesignerDivider':
      return <Divider {...node.props} />
    case 'FAB':
      return <FABPreview {...node.props} />
    default:
      return <h1>No component for type {type}</h1>
  }
}

export default RenderEditorData