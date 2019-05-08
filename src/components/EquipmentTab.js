import React, { Component } from 'react';
import styled from 'styled-components';

import Container from '../atoms/Container';
import List from '../atoms/List';
import Item from './Item';
import Search from './Search';
import Button from '../atoms/Button';
import Gold from './Gold';

import SrdItems from '../data/items.json';
const items = SrdItems.slice(0, 2);

const AddItem = styled(Button)`
  text-align: center;
`

class EquipmentTab extends Component {
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
    const { showAddItem, char: { pieces } } = this.props;
    const { copper, silver, etherium, gold, platinum } = pieces;

    return (
      <Container height='calc(100% - 40px)' width='calc(100% - 40px)' padding='20px' direction='row'>

        <Container width='58.5%'>
          <Search />

          <Container flowY='auto' height='calc(90% - 20px)' margin='10px 0'>
            <List>
              {
                items.map((item, i) => {
                  return (
                    <Item {...item} index={i} key={item.id} />
                  )
                })
              }
            </List>
          </Container>
          <AddItem onClick={showAddItem}>Add Item</AddItem>
        </Container>

        <Container width='30%' justifyContent='center' alignItems='center'>
          <Gold type='CP' amount={copper} />
          <Gold type='SP' amount={silver} />
          <Gold type='EP' amount={etherium} />
          <Gold type='GP' amount={gold} />
          <Gold type='PP' amount={platinum} />
        </Container>

      </Container>
    )
  }
}

export default EquipmentTab;