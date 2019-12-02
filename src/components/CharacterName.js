import React, { Component } from 'react';
import styled from 'styled-components';

import T from './Text';

import ChangeName from '../modals/SideInfo/ChangeName';

const Text = styled(T)`
  color: ${props => props.theme.gold};
  font-size: 1.7em;

  padding: 0 5px;
  width: 100%;

  @media only screen and (min-width: 768px) {
    font-size: 1.4vw;
  }
`

class CharacterName extends Component {
  constructor(props) {
    super(props);
  
    this.changeName = this.changeName.bind(this);
  }

  changeName() {
    const { openModal, closeModal } = this.props;

    openModal({
      id: 'namechangemodal',
      type: 'custom',
      content: <ChangeName {...this.props} requestClose={() => closeModal({ id: 'namechangemodal' })} />
    })
  }

  render() {
    const { name } = this.props;

    return (
      <Text onClick={this.changeName}>{name}</Text>
    )
  }
}

export default CharacterName;