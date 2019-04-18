import React, { Component } from 'react';
import styled from 'styled-components';

import Container from '../atoms/Container';
import Search from './Search';
import List from '../atoms/List';
import Item from './Item';
import Button from '../atoms/Button';

import SrdItems from '../data/items.json';

const BackDrop = styled(Container)`
  width: 35%;
  height: 80%;
  border-radius: 8px;
  background-color: ${props => props.theme.dark};
  box-shadow: 0 2px 10px rgba(0, 0, 0, .2), 0 0 0 1px rgba(28, 36, 43 .6);
  padding: 20px;
`

class AddItem extends Component { 
  constructor(props) {
    super(props);

    this.state = {
      search: ''
    }

    this.onSearch = this.onSearch.bind(this)
  }

  onSearch(event) {
    this.setState({ search: event.target.value })
  }

  render() {
    const { search } = this.state;

    return (
      <BackDrop onClick={(e) => {e.stopPropagation()}}>
        <Search onSearch={this.onSearch} value={search}
          bgStyle={{ backgroundColor: '#72767D', boxShadow: '0 2px 5px rgba(0, 0, 0, .2), 0 0 0 1px rgba(0, 0, 0, .1)'}}
          ph='rgba(255, 255, 255, .6)'
        />

        <Container flowY='auto' height='85%' margin='10px 0'>
          <List>
            {
              SrdItems.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
              .map(item => (
                <Item item={item} />
              ))
            }
          </List>
        </Container>
        <Button>Custom</Button>
      </BackDrop>
    )
  }
}

export default AddItem;