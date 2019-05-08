import React, { Component } from 'react';
import styled from 'styled-components';

import Container from '../../atoms/Container';
import Button from '../../atoms/Button';

import Search from './Search';
import ItemInfo from './ItemInfo';

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
      search: '',
      limit: 25,
      creatingItem: true,
      itemInfo: {}
    }

    this.onSearch = this.onSearch.bind(this)
    this.openItem = this.openItem.bind(this)
  }

  onSearch(event) {
    this.setState({ search: event.target.value })
  }

  // change the modal to show a item for approval / customization
  // before adding it to the item list.
  openItem(item) {
    this.setState({
      creatingItem: false,
      itemInfo: {
        name: 'Custom Item',
        desc: 'Item Description.',
        category: 'G',
        rarity: 'None',
        tags: []
      }
    })
  }

  render() {
    const { search, limit, creatingItem, itemInfo } = this.state;

    

    return (
      <BackDrop onClick={(e) => {e.stopPropagation()}}>
        {
          (creatingItem === false) ? <Search onSearch={this.onSearch} search={search} limit={limit} openItem={this.openItem} /> :
          <ItemInfo {...itemInfo} />
        }
      </BackDrop>
    )
  }
}

export default AddItem;