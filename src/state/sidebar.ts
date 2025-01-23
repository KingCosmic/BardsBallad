import { newRidgeState } from 'react-ridge-state'

export const sidebarState = newRidgeState<boolean>(false)

export const toggleSidebar = () => sidebarState.set((prevState) => !prevState)

export const openSidebar = () => sidebarState.set(true)

export const closeSidebar = () => sidebarState.set(false)