import './App.css'

import { BrowserRouter, Routes, Route } from 'react-router'

import { useEffect } from 'react'
import Layout from './layout'
import Characters from './routes/characters'
import { SidebarProvider } from './components/ui/sidebar'
import { ThemeProvider } from './components/providers/theme-provider'
import { AppSidebar } from './components/sidebars/app-sidebar'
import Settings from './routes/settings'
import Catacombs from './routes/catacombs'
import Library from './routes/library'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import Marketplace from './routes/marketplace'
import Character from './routes/characters/character'
import SecondarySidebar from './secondary-sidebar'
import { ScriptTypesProvider } from './components/providers/script-types'
import ScriptCacheProvider from './components/providers/script-cache'
import { ScriptRunnerProvider } from './components/providers/script-runner'
import Auth from './routes/auth'

const queryClient = new QueryClient()

const App: React.FC = () => {
  useEffect(() => {
    // Create floating particles
    function createParticle() {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 8 + 's';
      particle.style.animationDuration = (Math.random() * 6 + 4) + 's';
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
      <BrowserRouter>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <ScriptTypesProvider>
              <ScriptCacheProvider>
                <ScriptRunnerProvider>
                  <AppSidebar />
                  <Routes>
                    <Route path='/' element={<Layout />}>
                      <Route index element={<Characters />} />

                      <Route path='characters'>
                        <Route index element={<Characters />} />

                        <Route path=':id' element={<Character />} />
                      </Route>

                      <Route path='marketplace' element={<Marketplace />} />

                      <Route path='library'>
                        <Route index element={<Library />} />

                        {/* <Route path='system/:id' element={<System />} /> */}

                        {/* <Route path='datapack/:id' element={<DataPack />} /> */}
                      </Route>

                      <Route path='catacombs' element={<Catacombs />} />

                      <Route path='settings' element={<Settings />} />

                      <Route path='auth' element={<Auth />} />

                      {/* <Route path='subscription-confirmation' element={<SubscriptionConfirmation />} /> */}
                    </Route>
                  </Routes>
                  <SecondarySidebar />
                </ScriptRunnerProvider>
              </ScriptCacheProvider>
            </ScriptTypesProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </BrowserRouter>
    </SidebarProvider>
  )
}

export default App
