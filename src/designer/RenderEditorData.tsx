import ContainerPreview from './components/Container/Preview'
import TextPreview from './components/Text/Preview'
import { DividerPreview as Divider } from './components/Divider'

import { AddData } from './renderer/Context'
import { FABPreview } from './FloatingActionButton'
import SelectPreview from './components/Select/Preview'
import InputPreview from './components/Input/Preview'
import { PageData, SystemData } from '@storage/schemas/system'
import { Character } from '@storage/schemas/character'

type Props = {
  data: any
  style?: any
  state: { page: PageData, character: Character, system: SystemData }
  updateState: any
}

const RenderEditorData: React.FC<Props> = ({ data, style, state, updateState }) => {
  // TODO: process page blueprint.

  return (
    <div style={style}>
      <AddData localData={[]}>
        <NodeRenderer node={data.ROOT} data={data} state={state} updateState={updateState} />
      </AddData>
    </div>
  )
}

type RendererProps = {
  data: any
  node: any
  state: { page: PageData, character: Character, system: SystemData }
  updateState: any
}

const NodeRenderer: React.FC<RendererProps> = ({ node, data, state, updateState }) => {
  const type = (typeof node.type === 'object') ? node.type.resolvedName : node.type

  const Children = node.nodes.map((id: string) => <NodeRenderer key={id} node={data[id]} data={data} state={state} updateState={updateState} />)

  switch (type) {
    case 'Container':
      return <ContainerPreview {...node.props} state={state} updateState={updateState}>{Children}</ContainerPreview>
    case 'Text':
      return <TextPreview {...node.props} state={state} updateState={updateState} />
    case 'DesignerDivider':
      return <Divider {...node.props} state={state} updateState={updateState} />
    case 'FAB':
      return <FABPreview {...node.props} state={state} updateState={updateState} />
    case 'Select':
      return <SelectPreview {...node.props} state={state} updateState={updateState} />
    case 'TextInput':
      return <InputPreview {...node.props} state={state} updateState={updateState} />
    default:
      return <h1>No component for type {type}</h1> 
  }
}

export default RenderEditorData
