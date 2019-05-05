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
        ph='rgba(255, 255, 255, .6)'
      />

      <Container flowY='auto' height='85%' margin='10px 0'>
        <List>
          {
            SrdItems.slice(0, limit).filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
            .map((item, i) => (
              <Item {...item} index={i} />
            ))
          }
        </List>
      </Container>
      <Button onClick={() => openItem(null, true)}>Custom</Button>
    </Container>
  )
}

export default Search;