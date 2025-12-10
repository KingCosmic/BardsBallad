import './App.css'

import { BrowserRouter, Routes, Route } from 'react-router'

import { useEffect, lazy, Suspense } from 'react'
import Layout from './Layout'
import Characters from './routes/characters'
import { SidebarProvider } from './components/ui/sidebar'
import { ThemeProvider } from './components/providers/theme-provider'
import { AppSidebar } from './components/sidebars/app-sidebar'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import SecondarySidebar from './secondary-sidebar'
import { ScriptTypesProvider } from './components/providers/script-types'
import ScriptCacheProvider from './components/providers/script-cache'
import { ScriptRunnerProvider } from './components/providers/script-runner'
import { EditorProvider } from './components/providers/editor-provider'
import useSync from './hooks/sync/useSync'

// Lazy load routes
const Settings = lazy(() => import('./routes/settings'))
const Catacombs = lazy(() => import('./routes/catacombs'))
const Library = lazy(() => import('./routes/library'))
const Bazaar = lazy(() => import('./routes/marketplace'))
const BazaarItemInfo = lazy(() => import('./routes/marketplace/info'))
const Character = lazy(() => import('./routes/characters/character'))
const Auth = lazy(() => import('./routes/auth'))
const System = lazy(() => import('./routes/editors/system'))
const Campaigns = lazy(() => import('./routes/campaigns'))


const queryClient = new QueryClient()

const App: React.FC = () => {
  useSync()

  useEffect(() => {
    // Create floating particles
    function createParticle() {
      const particle = document.createElement('div');
      particle.className = 'particle';

      particle.style.transform = `scale(${0.5 + Math.random() * 0.8})`;

      const spawnX = 30 + Math.random() * 40; // between 30% and 70%
      particle.style.left = spawnX + '%';
      particle.style.marginLeft = `${(Math.random() - 0.5) * 40}px`; // small horizontal offset

      particle.style.animationDelay = Math.random() * 8 + 's';
      particle.style.animationDuration = (Math.random() * 6 + 4) + 's';

      particle.style.setProperty('--float-duration', `${4 + Math.random() * 6}s`);

      document.getElementById('particleContainer')!.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 18200);
    }

    // Generate particles periodically
    const interval = setInterval(createParticle, 2000);
    
    // Initial burst of particles
    for (let i = 0; i < 5; i++) {
      setTimeout(createParticle, i * 400);
    }

    return () => clearInterval(interval)
  }, [])

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 60)",
          "--header-height": "calc(var(--spacing) * 16)",
        } as React.CSSProperties
      }
    >
      <EditorProvider>
        <BrowserRouter>
          <ThemeProvider>
            <QueryClientProvider client={queryClient}>
              <ScriptTypesProvider>
                <ScriptCacheProvider>
                  <ScriptRunnerProvider>
                    <AppSidebar />
                    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                      <Routes>
                        <Route path='/' element={<Layout />}>
                          <Route index element={<Characters />} />

                          <Route path='characters'>
                            <Route index element={<Characters />} />

                            <Route path=':id' element={<Character />} />
                          </Route>

                          <Route path='bazaar'>
                            <Route index element={<Bazaar />} />
                          
                            <Route path='info/:id' element={<BazaarItemInfo />} />
                          </Route>

                          <Route path='campaigns' element={<Campaigns />} />

                          <Route path='library'>
                            <Route index element={<Library />} />

                            <Route path='system/:id' element={<System />} />

                            {/* <Route path='datapack/:id' element={<DataPack />} /> */}
                          </Route>

                          <Route path='catacombs' element={<Catacombs />} />

                          <Route path='settings' element={<Settings />} />

                          <Route path='auth' element={<Auth />} />

                          {/* <Route path='subscription-confirmation' element={<SubscriptionConfirmation />} /> */}
                        </Route>
                      </Routes>
                    </Suspense>
                    <SecondarySidebar />
                  </ScriptRunnerProvider>
                </ScriptCacheProvider>
              </ScriptTypesProvider>
            </QueryClientProvider>
          </ThemeProvider>
        </BrowserRouter>
      </EditorProvider>
    </SidebarProvider>
  )
}

export default App
