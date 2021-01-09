import React, { useState } from 'react'

import Container from './Container'
import SideNav from './SideNav'
import ViewContainer from './ViewContainer'

function Layout({ children }) {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false)

  return (
    <Container>
      {/*<Modals /> */}
      <SideNav isOpen={isSideNavOpen} setIsOpen={setIsSideNavOpen} />
      <ViewContainer>{children}</ViewContainer>
    </Container>
  )
}

export default Layout
