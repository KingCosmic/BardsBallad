import React from 'react'

import styled from 'styled-components'

import { Portal } from 'react-portal'

const BackDrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);

  display: flex;
  justify-content: center;
  align-items: center;
`

const Container = styled.div`
  max-width: 38%;
  max-height: 90%;
  background-color: ${props => props.theme.light};
  border-radius: 4px;

  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow-y: auto;
`

type Props = {
  isOpen: boolean,
  setIsOpen(open: boolean): void,
  children: JSX.Element | JSX.Element[]
}

function Modal(props: Props) {
  const { children, isOpen, setIsOpen } = props;

  return (
    isOpen ?
    <Portal>
      <BackDrop onClick={() => setIsOpen(false)}>
        <Container onClick={(e) => e.stopPropagation()}>
          {
            children
          }
        </Container>
      </BackDrop>
    </Portal> : null
  )
}

export default Modal