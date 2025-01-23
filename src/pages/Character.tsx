import { characterState, setCurrentCharacter } from '../state/character'
import { useEffect, useState } from 'react'

import { useParams } from 'react-router'
import { charactersState } from '../state/characters'

import { PageData } from '../state/systems'
import RenderEditorData from '../designer/RenderEditorData'

import Header from '../components/Header'

import lz from 'lzutf8'
import Select from '../components/inputs/Select'

const Character: React.FC = () => {
  const characters = charactersState.useValue()
  const character = characterState.useValue()

  const [tab, setTab] = useState(character ? character.system.pages[0].name : 'test')

  const { name } = useParams<{ name: string; }>()

  useEffect(() => {
    const character = characters.find(c => c.name === name)
    setCurrentCharacter(character)

    if (!character) return

    setTab(character.system.pages[0].name)
  }, [name])

  if (!character) return <>loading...</>

  return (
    <div>
      <Header title={name || 'loading'} />

      <div className='p-4'>
        <Select id='tab-selector' label='' value={tab} onChange={setTab}>
          {
            character.system.pages.map((page) => <option key={page.name} value={page.name}>{page.name}</option>)
          }
        </Select>

        {
          character.system.pages.map((page) => <RenderTab key={page.name} page={page} hidden={page.name !== tab} />)
        }
      </div>
    </div>
  )
}

function RenderTab({ page, hidden }: { page: PageData, hidden: boolean }) {
  return (
    <RenderEditorData style={{ display: hidden ? 'none': 'block' }} data={JSON.parse(lz.decompress(lz.decodeBase64(page.lexical)))} />
  )
}

export default Character;
