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
