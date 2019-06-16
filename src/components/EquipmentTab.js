import React, { Component } from 'react';

import Container from '../atoms/Container';
import List from '../atoms/List';
import Item from './Item';
import Search from './Search';
import Button from '../atoms/Button';
import Gold from './Gold';

import { typeFilters } from '../data/constants';

import { mergeUpdates } from '../helpers';

class EquipmentTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: 'ALL',
      search: ''
    }

    this.changeFilter = this.changeFilter.bind(this)
    this.onSearch = this.onSearch.bind(this)
  }

  onSearch(event) {
    this.setState({ search: event.target.value })
  }

  changeFilter(filter) {
    this.setState({ filter })
  }

  render() {
    const { search, filter } = this.state;
    const { showAddItem, showItemInfo, char: { pieces, items }, update, updateData, revertData } = this.props;
    const { copper, silver, etherium, gold, platinum } = pieces;

    const itemdata = mergeUpdates(items, update.items || []);

    return (
      <Container height='calc(100% - 40px)' width='calc(100% - 40px)' padding='20px' direction='row'>

        <Container width='58.5%'>
          <Search onSearch={this.onSearch} value={search} ph='Search Equipment...' filters={typeFilters} currentFilter={filter} onFilter={this.changeFilter} />

          <Container flowY='auto' height='calc(90% - 20px)' margin='10px 0'>
            <List>
              {
                itemdata.map((item, i) => {
                  return (
                    <Item {...item} index={i} key={item.id} onClick={() => showItemInfo(item.id)} />
                  )
                })
              }
            </List>
          </Container>
          <Button onClick={showAddItem}>Add Item</Button>
        </Container>

        <Container width='41.5%' justifyContent='flex-end' alignItems='flex-end'>
            <Gold type='CP' amount={copper} path='pieces.copper' update={update} updateData={updateData} revertData={revertData} />
            <Gold type='SP' amount={silver} path='pieces.silver' update={update} updateData={updateData} revertData={revertData} />
            <Gold type='EP' amount={etherium} path='pieces.etherium' update={update} updateData={updateData} revertData={revertData} />
            <Gold type='GP' amount={gold} path='pieces.gold' update={update} updateData={updateData} revertData={revertData} />
            <Gold type='PP' amount={platinum} path='pieces.platinum' update={update} updateData={updateData} revertData={revertData} />
        </Container>

      </Container>
    )
  }
}

export default EquipmentTab;