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
        <Group size='50' onClick={() => navigate('/app/creations')} />
      </MenuItem>

      <MenuItem>
        <Settings size='50' />
      </MenuItem>
    </Container>
  )
}

export default SideNav
