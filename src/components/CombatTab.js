import React, { Component } from 'react';

import Container from '../atoms/Container';
import Search from './Search';


class CombatTab extends Component { 
  constructor(props) {
    super(props);

    this.state = {
      filter: 'all',
      weapons: [],
      spells: []
    }

    this.changeFilter = this.changeFilter.bind(this);
  }

  changeFilter(filter) {
    this.setState({ filter })
  }
  
  render() {
    const {
      char: { items },
      data, editItem, updateData, editing, revertData
    } = this.props;
    const { filter } = this.state;

    const propData = { data, editItem, updateData, editing, revertData };

    return (
      <Container height='calc(100% - 40px)' width='calc(100% - 40px)' padding='20px'>
        <Container width='58.5%'>
        
          <Search />
        
        </Container>
      </Container>
    )
  }
}

export default CombatTab;