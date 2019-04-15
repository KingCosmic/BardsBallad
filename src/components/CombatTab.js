import React, { Component } from 'react';

import Container from '../atoms/Container';
import Filter from '../atoms/Filter';
import Text from '../atoms/Text';

class CombatTab extends Component { 
  constructor(props) {
    super(props);

    this.state = {
      filter: 'all'
    }

    this.changeFilter = this.changeFilter.bind(this);
  }

  changeFilter(filter) {
    this.setState({ filter })
  }
  
  render() {
    const { filter } = this.state;

    return (
      <Container height='calc(100% - 40px)' width='calc(100% - 40px)' padding='20px'>
        <Container direction='row' width='31em' underline>
          <Filter active={filter === 'all'}>all</Filter>
          <Filter active={filter === 'attack'}>attack</Filter>
          <Filter active={filter === 'action'}>action</Filter>
          <Filter active={filter === 'bonus action'}>bonus action</Filter>
          <Filter active={filter === 'reaction'}>reaction</Filter>
          <Filter active={filter === 'other'}>other</Filter>
          <Filter active={filter === 'limited use'}>limited use</Filter>
        </Container>
      </Container>
    )
  }
}

export default CombatTab;