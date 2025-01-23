import Header from '../components/Header'

import Select from '../components/inputs/Select'

import { themesState } from '../state/themes'
import { setErudaActive, setTheme, settingsState } from '../state/settings'
import Checkbox from '../components/inputs/Checkbox'
import Divider from '../components/Divider'

const Settings: React.FC = () => {
  const themes = themesState.useValue()
  const settings = settingsState.useValue()

  return (
    <div>
      <Header title='Settings' />

      <div className='p-4'>
        <Select id='theme' label='Theme' value={settings.theme} onChange={setTheme}>
          {themes.map(t => <option value={t.name}>{t.name}</option>)}
        </Select>

        <h4 className='mb-1'>Developer Settings</h4>
        <Divider />

        <p className='my-2'><a href='https://eruda.liriliri.io/' target='_blank'>Eruda</a> allows access to the development console on mobile.</p>
        <Checkbox id='use-eruda' label='Load Eruda' checked={settings.isErudaActive} onChange={setErudaActive} />
      </div>
    </div>
  )
}

export default Settings
