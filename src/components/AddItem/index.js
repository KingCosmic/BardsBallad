import React, { Component } from 'react';
import styled from 'styled-components';

import Container from '../../atoms/Container';

import Search from './Search';
import EditItem from './EditItem';

const BackDrop = styled(Container)`
  width: ${props => props.creating ? '30%' : '35%'};
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
      currentFilter: 'ALL',
      limit: 25,
      creatingItem: false,
      itemInfo: {},
    }

    this.onFilter = this.onFilter.bind(this)
    this.onSearch = this.onSearch.bind(this)
    this.openItem = this.openItem.bind(this)
    this.showItems = this.showItems.bind(this)
  }

  onFilter(value) {
    this.setState({ currentFilter: value })
  }

  onSearch(event) {
    this.setState({ search: event.target.value })
  }

  // change the modal to show a item for approval / customization
  // before adding it to the item list.
  openItem(item) {
    if (item) return this.setState({ creatingItem: true, itemInfo: item })

    this.setState({
      creatingItem: true
    })
  }

  showItems() {
    this.setState({
      creatingItem: false
    })
  }

  render() {
    const { search, limit, creatingItem, currentFilter, itemInfo } = this.state;
    const { addItem } = this.props;

    return (
      <BackDrop onMouseDown={(e) => e.stopPropagation()} creating={creatingItem}>
        {
          (creatingItem === false) ? <Search onSearch={this.onSearch} search={search} limit={limit} openItem={this.openItem} currentFilter={currentFilter} onFilter={this.onFilter} /> :
            <EditItem itemInfo={itemInfo} addItem={addItem} goBack={this.showItems} changeItem={this.changeItem} />
        }
      </BackDrop>
    )
  }
}

export default AddItem;