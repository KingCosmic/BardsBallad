import React, { Component } from 'react';
import styled from 'styled-components';

import Container from '../atoms/Container';
import Filter from '../atoms/Filter';
import List from '../atoms/List';
import Item from './Item';
import Title from '../atoms/Title';
import Text from '../atoms/Text';
import Search from './Search';
import Button from '../atoms/Button';

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
    const { char, showAddItem } = this.props;
    const { filter } = this.state;

    return (
      <Container height='calc(100% - 40px)' width='calc(100% - 40px)' padding='20px' direction='row'>

        <Container width='70%'>
          <Search />

          <Container flowY='auto' height='calc(90% - 20px)' margin='10px 0'>
            <List>
              {
                items.map((item, i) => {
                  return (
                    <Item item={item} />
                  )
                })
              }
            </List>
          </Container>
          <AddItem onClick={showAddItem}>Add Item</AddItem>
        </Container>

      </Container>
    )
  }
}

export default EquipmentTab;