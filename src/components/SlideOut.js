import React, { Component } from 'react';
import styled from 'styled-components';

import Container from '../atoms/Container';
import Title from '../atoms/Title';

import KoFi from '../assets/kofi.png';
import Patreon from '../assets/patreon.png'

const Backdrop = styled(Container)`
  width: 12%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background-color: ${props => props.theme.dark};
  border-right: 1px solid ${props => props.theme.almostblack};
`

class SlideOut extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    }
  }

  render() {
    const { open } = this.state;

    return (
      <Backdrop>
        <Title padding='5px'>Bards Ballad</Title>

      </Backdrop>
    )
  }
}

export default SlideOut;