import { useNode } from '@craftjs/core'
import { BlueprintData } from '@/types/blueprint'

type SearchbarProps = {
  placeholder: string;
  blueprint: BlueprintData;
}

function Searchbar({ placeholder }: SearchbarProps) {
  const { connectors: { connect, drag } } = useNode()

  return (
    <div ref={ref => connect(drag(ref!))} />
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
