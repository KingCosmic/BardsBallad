import React from 'react';
import styled, { keyframes } from 'styled-components';

const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, .3);

  display: flex;
  justify-content: center;
  align-items: center;
`

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

const Loader = styled.div`
  border: 1em solid ${props => props.theme.grey}; /* Light grey */
  border-top: 1em solid ${props => props.theme.gold}; /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: ${spin} 2s linear infinite;
`

const Loading = () => {
  return (
    <Backdrop>
      <Loader />
    </Backdrop>
  )
}

export default Loading;