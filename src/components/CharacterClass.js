import React, { Component } from 'react';
import styled from 'styled-components';

import T from './Text';

import ChangeClass from '../modals/SideInfo/ChangeClass';

//import { getLevel } from '../data/levels';

const Text = styled(T)`
  color: ${props => props.theme.text};
  font-size: 1.5em;

  padding: 5px;
  width: 100%;

  @media only screen and (min-width: 768px) {
    font-size: 1.2vw;
  }
`

class CharacterClass extends Component {
  constructor(props) {
    super(props);

    this.changeClass = this.changeClass.bind(this);
  }

  changeClass() {
    const { openModal, closeModal } = this.props;

    openModal({
      id: 'classchangemodal',
      type: 'custom',
      content: <ChangeClass {...this.props} requestClose={() => closeModal({ id: 'classchangemodal' })} />
    })
  }

  render() {
    const { job } = this.props;

    return (
      <Text onClick={this.changeClass}>{job}</Text>
    )
  }
}

export default CharacterClass;