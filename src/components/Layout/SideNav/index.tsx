import React from 'react'
import { navigate } from 'gatsby'

import Container from './Container'
import MenuItem from './MenuItem'

import { Settings } from '@styled-icons/ionicons-outline/Settings'
import { Group } from '@styled-icons/boxicons-solid/Group'


type Props = {
  isOpen:boolean,
  setIsOpen(open:boolean):void
}

function SideNav(props:Props) {
  return (
    <Container>
      <MenuItem>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor" onClick={() => navigate('/app/home')}>
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      </MenuItem>
      <MenuItem>
        <Group size='50' onClick={() => navigate('/app/creations')} />
      </MenuItem>

      <MenuItem>
        <Settings size='50' />
      </MenuItem>
    </Container>
  )
}

export default SideNav
