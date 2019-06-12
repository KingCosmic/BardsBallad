import React from 'react';

import Container from '../../atoms/Container';
import SearchInput from '../Search';
import List from '../../atoms/List';
import Item from '../Item';
import Button from '../../atoms/Button';

import SrdItems from '../../data/items.json';

const Search = ({ onSearch, search, openItem, limit }) => {
  return (
    <Container>
      <SearchInput onSearch={onSearch} value={search}
        bgStyle={{ backgroundColor: '#72767D', boxShadow: '0 2px 5px rgba(0, 0, 0, .2), 0 0 0 1px rgba(0, 0, 0, .1)'}}
      />

      <Container flowY='auto' height='85%' margin='10px 0'>
        <List>
          {
            SrdItems.filter(item => item.name.toLowerCase().includes(search.toLowerCase())).slice(0, limit)
            .map((item, i) => (
              <Item {...item} index={i} key={item.id} onClick={() => openItem(item)} />
            ))
          }
        </List>
      </Container>
      <Button onClick={() => openItem(null, true)}>Custom</Button>
    </Container>
  )
}

export default Search;