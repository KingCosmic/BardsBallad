import { useNode } from '@craftjs/core'
import { BlueprintData } from '@/types/blueprint'
import CompSearchbar from '@components/Searchbar'
import TextInput from '@components/inputs/TextInput';
import Button from '@components/inputs/Button';
import { openModal } from '@state/modals';
import ScriptEditor from '@modals/ScriptEditor';
import { Script } from '@/types/script';
import { useLocalState } from './hooks/useLocalState';
import { useVersionEdits } from '@hooks/useVersionEdits';
import { editorState } from '@state/editor';
import { SystemData } from '@storage/schemas/system';
import { useMemo } from 'react';

type SearchbarProps = {
  placeholder: string;
  script: Script;
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
  const { id, actions: { setProp }, placeholder, script } = useNode(node => ({
    placeholder: node.data.props.placeholder,
    script: node.data.props.script
  }))

  const localParams = useLocalState(id)

  const editor = editorState.useValue()
  const versionEdits = useVersionEdits<SystemData>(editor.versionId)

  const types = useMemo(() => versionEdits?.data.types ?? [], [versionEdits])

  return (
    <>
      <TextInput id='searchbar-placeholder' label='Placeholder' value={placeholder} onChange={val => setProp((props: any) => props.placeholder = val)} isValid errorMessage='' />
    
      <Button color='primary' onClick={() => {
        openModal('script', ({ id }) => (
          <ScriptEditor id={id} code={script}
            onSave={({ result }) => setProp((props: any) => props.script = result)}
            globals={localParams} expectedType='null' types={types}
          />
        ))
      }} />
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
