import { useNode } from '@craftjs/core'
import { BlueprintData } from '@/types/blueprint'
import CompSearchbar from '@components/Searchbar'

type SearchbarProps = {
  placeholder: string;
  blueprint: BlueprintData;
}

function Searchbar({ placeholder }: SearchbarProps) {
  const { connectors: { connect, drag } } = useNode()

  return (
    <div ref={ref => connect(drag(ref!))}>
      <CompSearchbar filters={[]} placeholder='testing' onSearch={() => {}} />
    </div>
  )
}

export function SearchbarPreview() {
  return (
    <CompSearchbar filters={[]} placeholder='testing' onSearch={() => {}} />
  )
}

function SearchbarSettings() {
  const { actions: { setProp }, placeholder, blueprint } = useNode(node => ({
    placeholder: node.data.props.placeholder,
    blueprint: node.data.props.blueprint
  }))

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
