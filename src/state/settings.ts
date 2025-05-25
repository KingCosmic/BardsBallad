import { newRidgeState } from 'react-ridge-state'

import { SettingsStorage } from '@lib/storage'

import { themesState } from './themes'
import { loadEruda, removeEruda } from '@utils/eruda';

enum ThemeEnum {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

type SettingsState = {
  theme: string;
  scheme: ThemeEnum
  isErudaActive: boolean
}

export const settingsState = newRidgeState<SettingsState>({
  theme: 'BardsBallad',
  scheme: ThemeEnum.DARK,
  isErudaActive: false
}, {
  onSet: (newState, previousState) => {
    SettingsStorage.set('settings', newState)

    if (previousState.isErudaActive && !newState.isErudaActive) {
      removeEruda()
    } else if (!previousState.isErudaActive && newState.isErudaActive) {
      loadEruda()
    }

    if ((newState.theme !== previousState.theme) || (newState.scheme !== previousState.scheme)) applyTheme()
  },
})

const loadSettings = async () => {
  const settings = await SettingsStorage.get<SettingsState>('settings')

  if (!settings) return

  settingsState.set(settings)
}

loadSettings()

export const setErudaActive = (active: boolean) => {
  settingsState.set(prevState => ({ ...prevState, isErudaActive: active }))
}

export const setTheme = (theme: string) => {
  settingsState.set(prevState => ({ ...prevState, theme }))
}

export const setScheme = (scheme: ThemeEnum) => {
  settingsState.set(prevState => ({ ...prevState, scheme }))
}

// update this to pull from storage or something so the colors don't change when the page loads.
export const applyTheme = () => {
  const themes = themesState.get()
  const currentSettings = settingsState.get()

  const themeData = themes.find(t => t.name === currentSettings.theme)

  if (!themeData) return

  // TODO: this needs to pull from the currentTheme.scheme to set light and dark colors appropriately
  
  document.documentElement.style.setProperty('--background', themeData.light.background)

  for (let color in themeData.light.brand) {
    // @ts-ignore
    document.documentElement.style.setProperty(`--brand-${color}`, themeData.light.brand[color])
  }

  for (let color in themeData.light.neutral) {
    // @ts-ignore
    document.documentElement.style.setProperty(`--neutral-${color}`, themeData.light.neutral[color])
  }

  for (let color in themeData.light.orange) {
    // @ts-ignore
    document.documentElement.style.setProperty(`--orange-${color}`, themeData.light.orange[color])
  }

  for (let color in themeData.light.red) {
    // @ts-ignore
    document.documentElement.style.setProperty(`--red-${color}`, themeData.light.red[color])
  }

  for (let color in themeData.light.blue) {
    // @ts-ignore
    document.documentElement.style.setProperty(`--blue-${color}`, themeData.light.blue[color])
  }

  for (let color in themeData.light.green) {
    // @ts-ignore
    document.documentElement.style.setProperty(`--green-${color}`, themeData.light.green[color])
  }
}
