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

import { sync } from './sync'
import SubscriptionConfirmation from './pages/SubscriptionConfirmation'
import Marketplace from './pages/Marketplace'

// @ts-ignore
window.trySync = sync

applyTheme()

const App: React.FC = () => {
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

          <Route path='library' element={<Library />} />

          <Route path='library/systems/:id' element={<System />} />

          <Route path='settings' element={<Settings />} />

          <Route path='subscription-confirmation' element={<SubscriptionConfirmation />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
