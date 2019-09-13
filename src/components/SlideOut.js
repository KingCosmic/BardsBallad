import React, { Component } from 'react';
import styled from 'styled-components';

import Container from '../atoms/Container';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

const Backdrop = styled(Container)`
  width: 12%;
  height: 100%;

  display: flex;
  align-items: center;

  background-color: ${props => props.theme.dark};
  border-right: 1px solid ${props => props.theme.almostblack};
`

const Item = styled(Text)`
  color: rgba(255, 255, 255, .9);
  cursor: pointer;
`

class SlideOut extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    }
  }

  render() {
    const { history } = this.props;
    // const { open } = this.state;

    return (
      <Backdrop>
        <Title padding='5px'>Bards Ballad</Title>

        <Item onClick={() => history.replace('/characters')}>Characters</Item>
      </Backdrop>
    )
  }
}

export default SlideOut;