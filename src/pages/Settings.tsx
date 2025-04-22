import Header from '../components/Header'

import Select from '../components/inputs/Select'

import { themesState } from '../state/themes'
import { setErudaActive, setTheme, settingsState } from '../state/settings'
import Checkbox from '../components/inputs/Checkbox'
import Divider from '../components/Divider'
import Button from '../components/inputs/Button'
import { logout, openBilling, subscribe, testApi } from '../lib/api'
import { authState } from '../state/auth'
import getPermsFromRole from '../utils/getPermsFromRole'
import { openModal } from '../state/modals'

const Settings: React.FC = () => {
  const themes = themesState.useValue()
  const settings = settingsState.useValue()

  const { isLoggedIn, user } = authState.useValue()

  return (
    <div>
      <Header title='Settings' />

      <div className='p-4'>
        <h4 className='mb-1 text-xl'>Account Settings</h4>
        <Divider />

        {(isLoggedIn && user) ? (
          <div className='my-2 flex flex-col gap-y-4 md:flex-row rtl:space-x-reverse flex-wrap'>
            <div className='flex flex-col w-full md:w-1/2'>
              <p className=''>Username</p>
              <p>{user.username}</p>
            </div>
            <div className='flex flex-col w-full md:w-1/2'>
              <p>Email</p>
              <p>{user.email}</p>
            </div>

            <div className='flex flex-col w-full md:w-1/2'>
              <p>Subscription</p>
              <p>{getPermsFromRole(user.role)}</p>
              {(user.role === 0) ? (
                <Button color='light' onClick={async () => {
                  const { url } = await subscribe()
        
                  window.open(url, '_self')
                }}>
                  Subscribe
                </Button>
              ) : (user.role === 1) ? (
                <Button color='light' onClick={async () => {
                  const { url } = await openBilling()
        
                  window.open(url, '_self')
                }}>
                  Manage Subscription
                </Button>
              ) : (<p>Thank you for everything!</p>)}
            </div>

            <div className='flex flex-col w-full md:w-1/2'>
              <p>WARNING</p>
              <p>Unsynced characters will be lost.</p>
              <Button color='danger' onClick={() => {
                logout()
              }}>
                Logout
              </Button>
            </div>

            <div className='flex flex-col w-full md:w-1/2'>
              <p>Refresh user info</p>
              <p>(ratelimited)</p>
              <Button color='light' onClick={() => {
                // TODO:
              }}>
                Update Info
              </Button>
            </div>
          </div>
        ) : <Button color='light' onClick={() => {
          openModal({
            type: 'authentication',
            title: '',
            data: null,
            onSave: () => {},
          })
        }}>Login / Register</Button>}

        <h4 className='my-1 text-xl'>General Settings</h4>
        <Divider />
        <div className='my-2' />

        <Select id='theme' label='Theme' value={settings.theme} onChange={setTheme}>
          {themes.map(t => <option value={t.name}>{t.name}</option>)}
        </Select>

        <h4 className='mb-1'>Developer Settings</h4>
        <Divider />

        <p className='my-2'><a className='underline' href='https://eruda.liriliri.io/' target='_blank'>Eruda</a> allows access to the development console on mobile.</p>
        <Checkbox id='use-eruda' label='Load Eruda' checked={settings.isErudaActive} onChange={setErudaActive} />

        <Button color='light' onClick={() => {
          testApi()
        }}>
          Test
        </Button>
      </div>
    </div>
  )
}

export default Settings
