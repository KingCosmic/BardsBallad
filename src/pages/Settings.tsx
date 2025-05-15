import Header from '../components/Header'

import Select from '../components/inputs/Select'

import { themesState } from '../state/themes'
import { setErudaActive, setTheme, settingsState } from '../state/settings'
import Checkbox from '../components/inputs/Checkbox'
import Button from '../components/inputs/Button'
import { logout, openBilling, subscribe } from '../lib/api'
import { authState } from '../state/auth'
import getPermsFromRole from '../utils/getPermsFromRole'
import { openModal } from '../state/modals'
import Tabs from '../components/Tabs'
import React from "react";

const tabs = [
  { id: 'profile', label: 'Profile', Content: ({ isLoggedIn, user }: any) => {
    return (
      <>
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
              <p>All local data is cleared (unsynced data will be lost)</p>
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
      </>
    )
  } 
},
  { id: 'general', label: 'General', Content: ({ settings, themes }: any) => {
    return (
      <Select id='theme' label='Theme' value={settings.theme} onChange={setTheme}>
        {themes.map((t: any) => <option value={t.name}>{t.name}</option>)}
      </Select>
    )
  }  },
  { id: 'developer', label: 'Developer', Content: ({ settings }: any) => {
    return (
      <>
        <p className='my-2'><a className='underline' href='https://eruda.liriliri.io/' target='_blank'>Eruda</a> allows access to the development console on mobile.</p>
        <Checkbox id='use-eruda' label='Load Eruda' checked={settings.isErudaActive} onChange={setErudaActive} />
      </>
    )
  }},
];

const Settings: React.FC = () => {
  const themes = themesState.useValue()
  const settings = settingsState.useValue()

  const { isLoggedIn, user } = authState.useValue()

  return (
    <div>
      <Header title='Settings' />

      <Tabs tabs={tabs} props={{ themes, settings, isLoggedIn, user }} />
    </div>
  )
}

export default Settings
