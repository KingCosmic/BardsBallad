import { NavLink, Outlet } from 'react-router'
import ModalManager from './components/ModalManager'
import { sidebarState, closeSidebar, openSidebar } from './state/sidebar'
import { authState } from './state/auth'
import Button from './components/inputs/Button'
import { closeModal, closeModalByTag, openModal } from './state/modals'
import { useEffect, useRef, useState } from 'react'
import { Onboarding } from './components/Onboarding'
import onboardingSteps from './lib/onboarding'
import { MiscStorage } from './lib/storage'
import ToastProvider from './components/ToastProvider'
import WelcomeMessage from './modals/WelcomeMessage'
import AuthModal from './modals/Auth'

const topItems = [
  {
    name: 'Home',
    path: ''
  },
  {
    name: 'Marketplace',
    path: 'marketplace',
  },
  {
    name: 'Characters',
    path: 'characters',
  },
  {
    name: 'Library',
    path: 'library',
  },
]

const bottomItems = [
  {
    icon: () => (
      <svg
        className='flex-shrink-0 w-5 h-5 text-neutral-500 transition duration-75 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white'
        aria-hidden='true'
        xmlns='http://www.w3.org/2000/svg'
        fill='currentColor'
        viewBox='0 0 21 21'
      >
        <path d='m5.4 2.736 3.429 3.429A5.046 5.046 0 0 1 10.134 6c.356.01.71.06 1.056.147l3.41-3.412c.136-.133.287-.248.45-.344A9.889 9.889 0 0 0 10.269 1c-1.87-.041-3.713.44-5.322 1.392a2.3 2.3 0 0 1 .454.344Zm11.45 1.54-.126-.127a.5.5 0 0 0-.706 0l-2.932 2.932c.029.023.049.054.078.077.236.194.454.41.65.645.034.038.078.067.11.107l2.927-2.927a.5.5 0 0 0 0-.707Zm-2.931 9.81c-.024.03-.057.052-.081.082a4.963 4.963 0 0 1-.633.639c-.041.036-.072.083-.115.117l2.927 2.927a.5.5 0 0 0 .707 0l.127-.127a.5.5 0 0 0 0-.707l-2.932-2.931Zm-1.442-4.763a3.036 3.036 0 0 0-1.383-1.1l-.012-.007a2.955 2.955 0 0 0-1-.213H10a2.964 2.964 0 0 0-2.122.893c-.285.29-.509.634-.657 1.013l-.01.016a2.96 2.96 0 0 0-.21 1 2.99 2.99 0 0 0 .489 1.716c.009.014.022.026.032.04a3.04 3.04 0 0 0 1.384 1.1l.012.007c.318.129.657.2 1 .213.392.015.784-.05 1.15-.192.012-.005.02-.013.033-.018a3.011 3.011 0 0 0 1.676-1.7v-.007a2.89 2.89 0 0 0 0-2.207 2.868 2.868 0 0 0-.27-.515c-.007-.012-.02-.025-.03-.039Zm6.137-3.373a2.53 2.53 0 0 1-.35.447L14.84 9.823c.112.428.166.869.16 1.311-.01.356-.06.709-.147 1.054l3.413 3.412c.132.134.249.283.347.444A9.88 9.88 0 0 0 20 11.269a9.912 9.912 0 0 0-1.386-5.319ZM14.6 19.264l-3.421-3.421c-.385.1-.781.152-1.18.157h-.134c-.356-.01-.71-.06-1.056-.147l-3.41 3.412a2.503 2.503 0 0 1-.443.347A9.884 9.884 0 0 0 9.732 21H10a9.9 9.9 0 0 0 5.044-1.388 2.519 2.519 0 0 1-.444-.348ZM1.735 15.6l3.426-3.426a4.608 4.608 0 0 1-.013-2.367L1.735 6.4a2.507 2.507 0 0 1-.35-.447 9.889 9.889 0 0 0 0 10.1c.1-.164.217-.316.35-.453Zm5.101-.758a4.957 4.957 0 0 1-.651-.645c-.033-.038-.077-.067-.11-.107L3.15 17.017a.5.5 0 0 0 0 .707l.127.127a.5.5 0 0 0 .706 0l2.932-2.933c-.03-.018-.05-.053-.078-.076ZM6.08 7.914c.03-.037.07-.063.1-.1.183-.22.384-.423.6-.609.047-.04.082-.092.129-.13L3.983 4.149a.5.5 0 0 0-.707 0l-.127.127a.5.5 0 0 0 0 .707L6.08 7.914Z' />
      </svg>
    ),
    name: 'Settings',
    path: 'settings'
  },
]

const Layout: React.FC = () => {
  const isOpen = sidebarState.useValue()

  const auth = authState.useValue()

  const [showOnboarding, setShowOnboarding] = useState(false)
  const hasRunRef = useRef(false)

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const checkOnboardingCompleted = async () => {
      const hasCompletedOnboarding = await MiscStorage.get('onboarding-completed')

      if (hasCompletedOnboarding) return;

      openModal('onboarding', ({ id }) => <WelcomeMessage yes={() => {
          closeModal(id)
          openSidebar()
          setShowOnboarding(true)
        }} no={() => {
          closeModal(id)
          MiscStorage.set('onboarding-completed', true)
        }} />
      )
    }
    
    checkOnboardingCompleted()

    return () => {
      closeModalByTag('onboarding')
    }
  }, [])

  return (
    <div className='w-screen h-screen-dynamic bg-neutral-50 dark:bg-neutral-900 text-primary transition-colors overflow-x-hidden'>
      <ToastProvider>

        {/* Onboarding Layer */}
        {showOnboarding && (
          <Onboarding steps={onboardingSteps} onFinish={() => {
            MiscStorage.set('onboarding-completed', true)
            setShowOnboarding(false)}
          }/>
        )}

        <div onClick={closeSidebar} className={`${isOpen ? '' : '-translate-x-full'} bg-neutral-950 opacity-65 fixed top-0 left-0 z-40 w-screen sm:w-64 h-screen-dynamic sm:translate-x-0`} />
        <aside
          onClick={closeSidebar}
          className={`${isOpen ? '' : '-translate-x-full'} border-r border-neutral-500 dark:border-neutral-700 bg-neutral-950 fixed top-0 left-0 z-40 w-64 h-screen-dynamic transition-transform sm:translate-x-0`}
          aria-label='Sidebar'
        >
          <div className='h-full flex flex-col justify-between px-3 py-4 overflow-y-auto bg-neutral-50 dark:bg-neutral-950' onClick={(e) => e.stopPropagation()}>
            <div>
              <a
                className='flex items-center ps-2.5 mb-5'
              >
                <svg className='h-11 me-3 sm:h-12' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 442 442'>
                  <g>
                    <g>
                      <path className='fill-brand-500' d='M221,442c-59.03,0-114.53-22.99-156.27-64.73S0,280.03,0,221,22.99,106.47,64.73,64.73C106.47,22.99,161.97,0,221,0s114.53,22.99,156.27,64.73c41.74,41.74,64.73,97.24,64.73,156.27s-22.99,114.53-64.73,156.27-97.24,64.73-156.27,64.73ZM221,12C105.76,12,12,105.76,12,221s93.76,209,209,209,209-93.76,209-209S336.24,12,221,12Z' />
                      <path className='fill-brand-500' d='M343,318c-10.28-3.95-23-4-30,1-8.96,6.4-14,18-27.89,17-13.33-.96-18.11-10-18.11-10,0,0,13-1,21-8,6.58-5.76,12-12,11-24-.91-10.96-8.94-16-18-16-14,0-22,11-22,11,0,0-3-11,10-30,14.43-21.09,37.58-34.03,45-50,13-28,8.03-51,8.03-51l5.18-5.04.76.92s-1.41,4-.41,7,4.86,2.66,7,2c2.91-.89,4-4,4-6s-3-5-3-5l-3.19-3.94,7.19-6.99,2.42,2.93s-1.41,4-.41,7,4.86,2.66,7,2c2.91-.89,4-4,4-6s-3-5-3-5l-4.83-5.96,7.26-7.07,3.43,4.15s-1.41,4-.41,7,4.86,2.66,7,2c2.91-.89,4-4,4-6s-3-5-3-5l-5.83-7.19.83-.81s3.33,2.68,6-1c2.93-4.04-2-7-2-7l-13-15s-1-4-5-3c-4.95,1.24-4,5-4,5l-.34.22-6.66-8.22s-2-2-5-2-6,2-7,5,0,6,3,6,5-2,5-2l4.32,5.24-8.36,5.3-5.4-6.66s-2-2-5-2-6,2-7,5,0,6,3,6,5-2,5-2l3.05,3.69-8.25,5.23-4.8-5.92s-2-2-5-2-6,2-7,5,0,6,3,6,5-2,5-2l2.44,2.96-91.7,58.17s-7.97,4.6-15.3,9c-5,3-9-4-9-4l-3-2-2.44,2s4.89,6.76,4.44,9c-1,5-5,1-5,1l-6-7-4-3-2,3,7.43,9s2.62,3,.57,5-6-3-6-3l-9.95-12-4.05-2-2,2,11,14s4,5,1,7-7-4-7-4l-14-18-5-2-1,3,14.89,23s4.11,4,.11,7c-3.39,2.55-6.85-1.6-6.85-1.6l-21.54-28-5.61-2.4-1,3,20,28s6.35,6.71,1,9c-7,3-11.75-4-11.75-4l-24.25-30-4-2-1,3,23.1,33s5.13,7,2.05,10c-3.08,3-8.92-2.5-8.92-2.5l-29.23-37.5-4-2-1,3,32.9,47s4.1,5,2.1,7c-3.23,3.23-6-1-6-1l-38-51-6-1-3,4s65.82,92,73,99,9.9,1,14,3,5.41,7.59,1,12c-6,6-11-1-11-1,0,0-68.15-92-78.4-106-10.26-14-15.22-27.04-16.6-38-2-16,2.57-39,20-43s33.07.64,42,13c13,18,18.46,26.33,29,34,11,8,33.57,10.15,49-4,12-11,9.91-29,9.91-29,0,0,20.47-10.15,26.09-27,7-21-8.5-37.38-3-59,3.12-12.27,14-22,28-22,18.03,0,23.78,11,23.78,11,0,0-5.65,0-10.78,5s-5.64,11.45-2,16c4,5,13,5,19,0,6.61-5.51,5.06-14,5.06-14,0,0,5.94-4,11.94,4,4.38,5.84,4.04,14.63,15,16,8,1,16-8,14-16-1.21-4.85-5.49-7.87-10-4-7,6,3.08,13.26-3,15-7,2-9-11-16-17-5.93-5.08-11-6-11-6,0,0-1-19-19-22-17.31-2.88-30.74,2.36-41,14-10.26,11.64-12.05,26-10,37s10.13,29,5,42-23.11,20-23.11,20c0,0-.89-11-5.89-17-6.46-7.75-13-13-27-12-10.02.72-23.05,11-21,25s17,15,17,15c0,0-9.27,9.07-27,4-14-4-14.89-13.18-30-22-20.23-11.82-37-6-42-3-4.62,2.77-18.99,11.98-19,40,0,24,13,40,13,40l-23,12s-6,2-8,7c-1.53,3.83,2,8,2,8l95,122s6.82,11,14,11c6,0,13-6,13-6,0,0,24.27-16,50.94-57s22.56-77.58,22.56-77.58l74.5-51.42s8-5,6-8c-1.76-2.64-9,3-9,3,0,0-116.44,74.29-119,76-3,2-4-2-4-2,0,0-2-6-6-10-2.7-2.7-6.08-3.16-7-5-1-2,1-4,3-5l108.67-73s8.99-8,25.33-5c8.31,1.53,15,8,15,8,0,0,7.97,8,9,18s-1.13,20-5.23,30-8.2,15-18.46,23c-10.26,8-25.2,13.19-37.31,20-16,9-22.84,24.61-27,35-2,5-4.18,20,3,31s24,15,24,15c0,0,3.85,5,10,9s14.02,5.61,22,5c13-1,16.25-8.83,24-14,6-4,16.18-4,24.38,1,8.2,5,15.62,16.58,15.62,28,0,12-1.8,19-10,27s-15.54,11-34,11-29-1-38-7c-11.91-7.94-12.92-15.81-24-28-10-11-21.69-15-34-15-8,0-15.49,1.49-24,10-7,7-7,18-7,18,0,0-4,2-10,9-5.14,5.99-10,13-17,14-10.58,1.51-17.59-2-17.59-2,0,0,1.62-3,.59-5s-3.9-3-8-3-6.74,4.26-2,9c3,3,6.52,5.77,17,7,17,2,22.94-7.94,28-13,7-7,11-8,11-8,0,0,2,5,7,8,3.15,1.89,10,3,15,1,5.95-2.38,7-10,4-15-2.78-4.63-12-5-12-5,0,0,3-8,16-6,8.95,1.38,13.96,5.04,28,18,13,12,30.32,14.88,50,16,35,2,47.44,0,59.74-10,12.31-10,15.54-33.28,13.26-44s-10.59-20-21-24ZM274,66c-7,4-12-2-11-7,.78-3.92,4-7,12-8,0,0,5.14,11.49-1,15ZM147,132c-1.05-6.32,3-16,13-17s12,6,12,12c0,10.44-7,16-7,16-9,0-17-5-18-11ZM164,252c0,10.49-8.51,19-19,19s-19-8.51-19-19,8.51-19,19-19,19,8.51,19,19ZM347,107s7.18,5.73,8,9c.49,1.94.03,3.42-.57,4.43l-12.11-14.93c3.12-.83,4.68,1.5,4.68,1.5ZM335.77,109.21l13.37,16.2-7.54,6.66-14.23-17.55c3.21-2.03,6.11-3.86,8.41-5.3ZM321.04,118.52l15.13,18.33-7.46,6.58-15.94-19.66c2.74-1.74,5.54-3.52,8.27-5.25ZM310,142c-8.3-6.64-18-5-18-5,0,0,6.33-4.04,14.44-9.21l16.85,20.42-4.29,3.79s-4-6-9-10ZM261,299s2-7,9-12,15-5,19-2c5.06,3.79,5.41,11.18,3,16-2,4-9.11,10.32-17,9-12-2-14-11-14-11ZM198,374c4.47,0,7,4,6,7-1.14,3.42-7,3-10,1-2.35-1.57-4-6-4-6,0,0,3-2,8-2Z' />
                    </g>
                  </g>
                </svg>
                <div>
                  <span className='self-center text-xl font-semibold whitespace-nowrap dark:text-white'>
                    BardsBallad
                  </span>
                  <p className='text-neutral-500'>
                    v0.1.0
                  </p>
                </div>
              </a>
              <ul className='pt-4 mt-4 space-y-2 font-medium border-t border-neutral-200 dark:border-neutral-700'>
                {topItems.map((item) => (
                  <li key={item.name}>
                    <NavLink id={`nav-${item.name}`} to={item.path} onClick={closeSidebar}>
                      <div className='flex items-center p-2 text-neutral-900 rounded-lg dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 group'>
                        <svg
                          className='w-5 h-5 text-neutral-500 transition duration-75 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white'
                          aria-hidden='true'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='currentColor'
                          viewBox='0 0 22 21'
                        >
                          <path d='M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z' />
                          <path d='M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z' />
                        </svg>
                        <span className='ms-3'>{item.name}</span>
                      </div>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div
                id='dropdown-cta'
                className='p-4 mt-6 rounded-lg bg-brand-50 bg-gradient-to-r dark:from-brand-500 dark:to-brand-700'
                role='alert'
              >
                <div className='flex items-center mb-3'>
                  <span className='bg-brand-100 text-brand-800 text-sm font-semibold me-2 px-2.5 py-0.5 rounded dark:bg-brand-200 dark:text-brand-900'>
                    Beta
                  </span>
                </div>
                <p className='mb-3 text-sm text-brand-800 dark:text-brand-100'>
                  We're happy you're using the BardsBallad Beta! If you run into any problems please reach out to us through one of the platforms below!
                </p>
              </div>

              <div className='flex items-center my-2 gap-2 px-1'>
                <a href='https://discord.gg/a5qSfxv' target='_blank' className='bg-neutral-700 p-1 rounded border border-neutral-600'>
                  <svg xmlns="http://www.w3.org/2000/svg" className='w-8 h-8 fill-neutral-300 hover:fill-brand-400 transition-colors' viewBox="0 0 512 512"><path d="M464 66.52A50 50 0 00414.12 17L97.64 16A49.65 49.65 0 0048 65.52V392c0 27.3 22.28 48 49.64 48H368l-13-44 109 100zM324.65 329.81s-8.72-10.39-16-19.32C340.39 301.55 352.5 282 352.5 282a139 139 0 01-27.85 14.25 173.31 173.31 0 01-35.11 10.39 170.05 170.05 0 01-62.72-.24 184.45 184.45 0 01-35.59-10.4 141.46 141.46 0 01-17.68-8.21c-.73-.48-1.45-.72-2.18-1.21-.49-.24-.73-.48-1-.48-4.36-2.42-6.78-4.11-6.78-4.11s11.62 19.09 42.38 28.26c-7.27 9.18-16.23 19.81-16.23 19.81-53.51-1.69-73.85-36.47-73.85-36.47 0-77.06 34.87-139.62 34.87-139.62 34.87-25.85 67.8-25.12 67.8-25.12l2.42 2.9c-43.59 12.32-63.44 31.4-63.44 31.4s5.32-2.9 14.28-6.77c25.91-11.35 46.5-14.25 55-15.21a24 24 0 014.12-.49 205.62 205.62 0 0148.91-.48 201.62 201.62 0 0172.89 22.95s-19.13-18.15-60.3-30.45l3.39-3.86s33.17-.73 67.81 25.16c0 0 34.87 62.56 34.87 139.62 0-.28-20.35 34.5-73.86 36.19z"/><path d="M212.05 218c-13.8 0-24.7 11.84-24.7 26.57s11.14 26.57 24.7 26.57c13.8 0 24.7-11.83 24.7-26.57.25-14.76-10.9-26.57-24.7-26.57zM300.43 218c-13.8 0-24.7 11.84-24.7 26.57s11.14 26.57 24.7 26.57c13.81 0 24.7-11.83 24.7-26.57S314 218 300.43 218z"/></svg>
                </a>
                
                <a href='https://github.com/KingCosmic/BardsBallad' target='_blank' className='bg-neutral-700 p-1 rounded border border-neutral-600'>
                  <svg xmlns="http://www.w3.org/2000/svg" className='w-8 h-8 fill-neutral-300 hover:fill-brand-400 transition-colors' viewBox="0 0 512 512"><path d="M256 32C132.3 32 32 134.9 32 261.7c0 101.5 64.2 187.5 153.2 217.9a17.56 17.56 0 003.8.4c8.3 0 11.5-6.1 11.5-11.4 0-5.5-.2-19.9-.3-39.1a102.4 102.4 0 01-22.6 2.7c-43.1 0-52.9-33.5-52.9-33.5-10.2-26.5-24.9-33.6-24.9-33.6-19.5-13.7-.1-14.1 1.4-14.1h.1c22.5 2 34.3 23.8 34.3 23.8 11.2 19.6 26.2 25.1 39.6 25.1a63 63 0 0025.6-6c2-14.8 7.8-24.9 14.2-30.7-49.7-5.8-102-25.5-102-113.5 0-25.1 8.7-45.6 23-61.6-2.3-5.8-10-29.2 2.2-60.8a18.64 18.64 0 015-.5c8.1 0 26.4 3.1 56.6 24.1a208.21 208.21 0 01112.2 0c30.2-21 48.5-24.1 56.6-24.1a18.64 18.64 0 015 .5c12.2 31.6 4.5 55 2.2 60.8 14.3 16.1 23 36.6 23 61.6 0 88.2-52.4 107.6-102.3 113.3 8 7.1 15.2 21.1 15.2 42.5 0 30.7-.3 55.5-.3 63 0 5.4 3.1 11.5 11.4 11.5a19.35 19.35 0 004-.4C415.9 449.2 480 363.1 480 261.7 480 134.9 379.7 32 256 32z"/></svg>
                </a>

                <a href='mailto:support@bardsballad.com' target='_blank' className='bg-neutral-700 p-1 rounded border border-neutral-600'>
                  <svg viewBox="0 0 24 24" className='w-8 h-8 fill-neutral-300 hover:fill-brand-400 transition-colors' xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M3.75 5.25L3 6V18L3.75 18.75H20.25L21 18V6L20.25 5.25H3.75ZM4.5 7.6955V17.25H19.5V7.69525L11.9999 14.5136L4.5 7.6955ZM18.3099 6.75H5.68986L11.9999 12.4864L18.3099 6.75Z"></path> </g></svg>
                </a>
              </div>
              <ul className='pt-4 mt-2 space-y-2 font-medium border-t border-neutral-200 dark:border-neutral-700'>
                {!auth.isLoggedIn && (
                  <li>
                    <Button className='w-full' color='primary' onClick={() => {
                      openModal('auth', ({ id }) => <AuthModal id={id} />)
                    }}>Login / Register</Button>
                  </li>
                )}
                {bottomItems.map((item) => (
                  <li key={item.name}>
                    <NavLink id={`nav-${item.name}`} to={item.path} onClick={closeSidebar}>
                      <div className='flex items-center p-2 text-neutral-900 rounded-lg dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 group'>
                        {item.icon()}
                        <span className='ms-3'>{item.name}</span>
                      </div>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        <div className='sm:ml-64 h-screen-dynamic'>
          <Outlet />
        </div>

        <ModalManager />
      </ToastProvider>
    </div>
  )
}

export default Layout
