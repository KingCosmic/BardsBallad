import React from 'react'

import styled, { ThemeProvider } from 'styled-components'
import { Router as R } from '@reach/router'

import withAuth from '../components/WithAuth'

import theme from '../theme'

import Layout from '../components/Layout'
import Character from '../components/Character'

const Router = styled(R)`
  width: 100%;
  height: 100%;
`

function App() {
  return (<h1>testing</h1>/*
    <ThemeProvider theme={theme}>
        <Layout>
          <Router>
            <Creations path='/app/creations' />
            <Character path='/app/characters/:characterID' />
          </Router>
        </Layout>
    </ThemeProvider>
  */)
}

export default withAuth(App)
