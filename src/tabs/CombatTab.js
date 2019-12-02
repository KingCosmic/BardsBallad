import React, { Component } from 'react';
import styled from 'styled-components';

import Text from '../components/Text';

import Section from '../components/ListSection';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 15px;
  padding-top: 70px;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`

const Title = styled(Text)`
  font-size: 2em;
`

const AddButton = () => {
  return (
    <Title>&#43;</Title>
  )
}

class CombatTab extends Component {
  render() {
    return (
      <Container>

        <Section title='Conditions' HeaderExtra={() => <AddButton />} showOnEmpty />

        <Section title='Attacks' showOnEmpty />

        <Section title='Creatures' showOnEmpty />

      
      </Container>
    )
  }
}

export default CombatTab;