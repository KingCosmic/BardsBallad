import React, { useState } from 'react'
import { navigate } from 'gatsby'

import Container from './Container'
import MenuItem from './MenuItem'

import { Settings } from '@styled-icons/ionicons-outline/Settings'
import { Group } from '@styled-icons/boxicons-solid/Group'


function SideNav() {
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
