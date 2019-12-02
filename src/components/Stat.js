import React, { Component } from 'react';
import styled from 'styled-components';

import B from './Bonus';
import T from './Text';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  padding: 10px;
  align-items: center;
  width: 33.33%;
  border: 2px solid ${props => props.theme.almostblack};

  @media only screen and (min-width: 768px) {
    background: ${props => props.theme.dark};
    width: 32%;
    padding: 5px;
    margin: 5px;
    justify-content: center;
    border: 1px solid ${props => props.theme.almostblack};
  }
`

const Text = styled(T)`
  font-size: 1.5em;

  @media only screen and (min-width: 768px) {
    font-size: 1.25vw;
  }
`

const Bonus = styled(B)`
  font-size: 1.5em;

  @media only screen and (min-width: 768px) {
    font-size: 1.25vw;
  }
`

class CharacterStat extends Component {
  constructor(props) {
    super(props);

    this.editStat = this.editStat.bind(this)
  }

  editStat() {
    const { path, name, syncData, characterID, value, openModal, closeModal } = this.props;

    openModal({
      id: 'stateditmodal',
      type: 'number',
      title: `Edit ${name}`,
      defaultValue: value,
      min: 0,
      onCancel: () => closeModal({ id: 'stateditmodal' }),
      onConfirm: (newValue) => {
        if (newValue === value) return closeModal({ id: 'stateditmodal' });

        closeModal({ id: 'stateditmodal' })
        syncData(
          characterID,
          {
            [path]: newValue
          }
        )
      }
    })
  }

  render() {
    const { name, value } = this.props;

    return (
      <Container onClick={this.editStat}>
        <Text color='gold'>{name}</Text>

        <Bonus value={value} />

        <Text>{value}</Text>
      </Container>
    )
  }
}

export default CharacterStat;