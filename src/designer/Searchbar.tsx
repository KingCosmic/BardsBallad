import { useNode } from '@craftjs/core'
import { BlueprintData } from '@/types/blueprint'
import CompSearchbar from '@components/Searchbar'
import TextInput from '@components/inputs/TextInput';
import Button from '@components/inputs/Button';
import { openModal } from '@state/modals';
import BlueprintEditor from '@modals/BlueprintEditor';

type SearchbarProps = {
  placeholder: string;
  blueprint: BlueprintData;
}

function Searchbar({ placeholder }: SearchbarProps) {
  const { connectors: { connect, drag } } = useNode()

  return (
    <div ref={ref => connect(drag(ref!))}>
      <CompSearchbar filters={[]} placeholder={placeholder} onSearch={() => {}} />
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
      <TextInput id='searchbar-placeholder' label='Placeholder' value={placeholder} onChange={val => setProp((props: any) => props.placeholder = val)} isValid errorMessage='' />
    
      <Button color='primary' onClick={() => openModal('edit-blueprint', ({ id }) => (
        <BlueprintEditor id={id} data={blueprint} onSave={(bp) => setProp((props: any) => props.blueprint = bp)} />
      ))} />
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
