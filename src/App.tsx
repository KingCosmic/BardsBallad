import './App.css'

import { BrowserRouter, Routes, Route } from 'react-router'

import Layout from './Layout'
import Home from './pages/Home'

import Characters from './pages/Characters'
import Character from './pages/Character'
import Library from './pages/Library'
import System from './pages/System'

import { applyTheme } from './state/settings'
import Settings from './pages/Settings'

import SubscriptionConfirmation from './pages/SubscriptionConfirmation'
import Marketplace from './pages/Marketplace'
import { useEffect } from 'react'
import DataPack from '@pages/DataPack'

applyTheme()

const App: React.FC = () => {

  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    return () => window.removeEventListener('resize', setVH);
  }, [])

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
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />

          <Route path='characters'>
            <Route index element={<Characters />} />

            <Route path=':id' element={<Character />} />
          </Route>

          <Route path='marketplace' element={<Marketplace />} />

          <Route path='library'>
            <Route index element={<Library />} />

            <Route path='system/:id' element={<System />} />

            <Route path='datapack/:id' element={<DataPack />} />
          </Route>

          <Route path='settings' element={<Settings />} />

          <Route path='subscription-confirmation' element={<SubscriptionConfirmation />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
