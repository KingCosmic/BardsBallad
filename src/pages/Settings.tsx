import Header from '@components/Header'

import Select from '@components/inputs/Select'

import { themesState } from '@state/themes'
import { setErudaActive, setReactScanActive, setTheme, settingsState } from '@state/settings'
import Checkbox from '@components/inputs/Checkbox'
import Button from '@components/inputs/Button'
import { authState } from '@state/auth'
import roleToString from '@utils/roles/roleToString'
import { openModal } from '@state/modals'
import Tabs from '@components/Tabs'
import React from "react";
import {subscribe} from "@api/subscribe";
import {openBilling} from "@api/openBilling";
import {logout} from "@api/logout";
import ConfirmModal from '@modals/ConfirmModal'
import AuthModal from '@modals/Auth'
import clearLocalStorage from '@utils/clearLocalStorage'
import getLoginLink from '@api/discord/getLoginLink'
import { hasRole } from '@utils/roles/hasRole'
import Roles from '@/const/roles'

const tabs = [
  { id: 'profile', label: 'Profile', Content: ({ isLoggedIn, user }: any) => {
    return (
      <div className='max-w-5xl mx-auto'>
        {(isLoggedIn && user) ? (
          <div className='my-2 flex flex-col gap-4 lg:grid lg:grid-cols-2 rtl:space-x-reverse flex-wrap'>

            <div className='flex flex-col w-full bg-neutral-800 p-4 rounded-lg border-neutral-500 border'>
              {/* Header */}
              <div className="flex items-center">
                <div className="w-12 h-12 fantasy-accent-gradient rounded-xl flex items-center justify-center text-xl font-bold text-fantasy-dark mr-4 shadow-lg shadow-fantasy-accent/30">
                  {user.username[0]}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-fantasy-text mb-1">{user.username}</h3>
                  <div className="flex items-center gap-2 text-xs text-fantasy-accent/70">
                    <span>{user.email}</span>
                    <span className="bg-fantasy-accent/20 px-1.5 py-0.5 rounded text-[10px]">{roleToString(user.role)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className='flex flex-col w-full bg-fantasy-dark p-4 rounded-lg border-fantasy-border border'>
              <p className='text-lg'>Subscription</p>
              <p className='mb-4'>Current Tier: {roleToString(user.role)}</p>
              <Button color='primary' onClick={async () => {
                let url = ''

                const isPremium = hasRole(user.role, Roles.PREMIUM)
                const isNormalUser = hasRole(user.role, Roles.FREE) || hasRole(user.role, Roles.PREMIUM)

                if (isNormalUser && !isPremium) {
                  const { data: newUrl } = await subscribe()
                  url = newUrl
                } else if (isNormalUser && isPremium) {
                  const { data: newUrl } = await openBilling()
                  url = newUrl
                }

                window.open(url, '_self')
              }}>
                {(hasRole(user.role, Roles.FREE)) ? 'Subscribe' : (hasRole(user.role, Roles.PREMIUM)) ? 'Manage Subscription' : 'Thank you for everything!'}
              </Button>
            </div>

            {!user.discord_id ? (
              <div className='flex flex-col w-full bg-neutral-800 p-4 rounded-lg border-indigo-500 border'>
                <p className='text-lg'>Discord Integration</p>
                <p className='mb-4'>Link your Discord account to access additional features</p>
                <Button color='primary' onClick={getLoginLink}>
                  Connect Discord Account
                </Button>
              </div>
            ) : (
              <div className='flex flex-col w-full bg-neutral-800 p-4 rounded-lg border-indigo-500 border'>
                <p className='text-lg'>Discord Integration</p>
                <p className='mb-4'>Discord linked!</p>
                <Button color='danger' onClick={getLoginLink}>
                  Disonnect
                </Button>
              </div>
            )}

            <div className='flex flex-col w-full bg-neutral-800 p-4 rounded-lg border-red-500 border'>
              <p className='text-lg'>Danger Zone</p>
              <p className='mb-4 text-red-500'>All local data is cleared (unsynced data will be lost)</p>
              <Button color='danger' onClick={() =>
                openModal('confirm', ({ id }) => (
                  <ConfirmModal id={id} title='Logout' type='danger' message='All local data is cleared (unsynced data will be lost)' onConfirm={logout} />
                ))
              }>
                Logout
              </Button>
            </div>
          </div>
        ) : (
        <div className='flex flex-col items-center justify-center h-full'>
          <p className='text-lg'>You are not logged in</p>
          <p className='mb-4'>Login to access your profile</p>
          <Button color='light' onClick={() => openModal('auth', ({ id }) => <AuthModal id={id} />)}>Login / Register</Button>
        </div>
      )}
      </div>
    )
  } 
},
  { id: 'general', label: 'General', Content: ({ settings, themes }: any) => {
    return (
      <Select id='theme' label='Theme' value={settings.theme} onChange={setTheme}>
        {themes.map((t: any) => <option value={t.name}>{t.name}</option>)}
      </Select>
    )
  }},
  { id: 'developer', label: 'Developer', Content: ({ settings }: any) => {
    return (
      <>
        <p className='my-2'><a className='underline' href='https://eruda.liriliri.io/' target='_blank'>Eruda</a> allows access to the development console on mobile.</p>
        <Checkbox id='use-eruda' label='Load Eruda' checked={settings.isErudaActive} onChange={setErudaActive} />

        <p className='my-2'><a className='underline' href='https://react-scan.com/' target='_blank'>React Scan</a> helps to visually track down performance problems caused by rerenders.</p>
        <Checkbox id='use-reactscan' label='Load ReactScan' checked={settings.isReactScanActive} onChange={setReactScanActive} />

        <p className='my-2'>Clear Local Storage</p>
        <Button color='danger' onClick={() => openModal('clear-local-storage', ({ id }) => (
          <ConfirmModal id={id} title='Clear Local Storage' type='danger' message='Clearing local storage will remove everything from this device. all unsynced data will be lost.' onConfirm={clearLocalStorage} />
        ))}>Clear Local Storage</Button>
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
