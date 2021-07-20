import React, { useState } from 'react'
import styled from 'styled-components'

import { syncState } from '../../state/sync'

import Modal from './Modal'

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(100% - 60px);
  width: 100%;
  padding: 10px;
  padding-bottom: 0;
  overflow-y: auto;
`

function Sync() {
  const [state, setState] = syncState.use()

  return (
    <Modal isOpen={state.syncIssues} setIsOpen={(open) => setState({ ...state, syncIssues: open })}>
      <Container>
        Testing
      </Container>
    </Modal>
  )
}

export default Sync