import React, { useState } from 'react'
import { ThemeProvider } from 'styled-components'
import theme from '../../theme'

import Container from './Container'
import SideNav from './SideNav'
import ViewContainer from './ViewContainer'

import withAuth from '../WithAuth'

function Layout({ children }) {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false)

  return (
    <ThemeProvider theme={theme}>
      <Container>
        {/*<Modals /> */}
        <SideNav isOpen={isSideNavOpen} setIsOpen={setIsSideNavOpen} />
        <ViewContainer>{children}</ViewContainer>
      </Container>
    </ThemeProvider>
  )
}

export default withAuth(Layout)
