import { newRidgeState } from 'react-ridge-state'

type SidebarState = {
	main: boolean
	secondary: boolean
}

export const sidebarState = newRidgeState<SidebarState>({ main: false, secondary: false })

// Main sidebar helpers
export const toggleMainSidebar = () => sidebarState.set(prev => ({ ...prev, main: !prev.main }))
export const openMainSidebar = () => sidebarState.set(prev => ({ ...prev, main: true }))
export const closeMainSidebar = () => sidebarState.set(prev => ({ ...prev, main: false }))

// Secondary sidebar helpers
export const toggleSecondarySidebar = () => sidebarState.set(prev => ({ ...prev, secondary: !prev.secondary }))
export const openSecondarySidebar = () => sidebarState.set(prev => ({ ...prev, secondary: true }))
export const closeSecondarySidebar = () => sidebarState.set(prev => ({ ...prev, secondary: false }))