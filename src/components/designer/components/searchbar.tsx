import { Script } from '@/types/script';
import { useNode } from '@craftjs/core'

type SearchbarProps = {
  placeholder: string;
  script?: Script;
}

function Searchbar({}: SearchbarProps) {
  const { connectors: { connect, drag } } = useNode()

  return (
    // @ts-ignore
    <div ref={ref => connect(drag(ref!))}>
      {/* <CompSearchbar filters={[]} placeholder={placeholder} onSearch={() => {}} /> */}
    </div>
  )
}

export function SearchbarPreview() {
  return (
    <></>
    // <CompSearchbar filters={[]} placeholder='testing' onSearch={() => {}} />
  )
}

function SearchbarSettings() {
  // const { id, actions: { setProp }, placeholder, script } = useNode(node => ({
  //   placeholder: node.data.props.placeholder,
  //   script: node.data.props.script
  // }))

  // const localParams = useLocalState(id)

  // const editor = editorState.useValue()
  // const versionEdits = useVersionEdits<SystemData>(editor.versionId)

  // const types: SystemType[] = useMemo(() => [
  //   versionEdits?.data.defaultCharacterData._type,
  //   ...(versionEdits?.data.types ?? [])
  // ], [versionEdits])

  return (
    <>
      
    </>
  )
} 

Searchbar.craft = {
  rules: {},
  related: {
    settings: SearchbarSettings
  }
}

export default Searchbar
