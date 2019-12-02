import React, { Component } from 'react';
import styled from 'styled-components';

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

class HitDice extends Component {
  constructor(props) {
    super(props);

    this.editStat = this.editStat.bind(this)
  }

  editStat() {
    const { path, syncData, characterID, value, openModal, closeModal } = this.props;

    openModal({
      id: 'hdeditmodal',
      type: 'string',
      title: 'Edit HitDice',
      defaultValue: value,
      onCancel: () => closeModal({ id: 'hdeditmodal' }),
      onConfirm: (newValue) => {
        if (newValue === value) return closeModal({ id: 'hdeditmodal' });

        closeModal({ id: 'hdeditmodal' })
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
    const { value } = this.props;

    return (
      <Container onClick={this.editStat}>
        <Text color='gold'>HD</Text>

        <Text>{value}</Text>
      </Container>
    )
  }
}

export default HitDice;