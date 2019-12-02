import React from 'react';
import styled from 'styled-components';

import Button from '../../components/Button';

import SearchInput from '../../components/Search';
import Item from '../../components/Item';

import { typeFilters } from '../../data/constants';

import srdEquipment from '../../data/equipment.json';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 15px;
`

const List = styled.div`
  overflow-y: auto;
  padding: 10px 0;
`

const CustomButton = styled(Button)`

`

const Search = ({ onSearch, search, filter, changeFilter, openItem, limit }) => {
  const filteredSrd = srdEquipment.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <Container>
      <SearchInput onSearch={onSearch} value={search} ph='Search Equipment...' filters={typeFilters} currentFilter={filter} onFilter={changeFilter}
        bgStyle={{ backgroundColor: '#72767D', boxShadow: '0 2px 5px rgba(0, 0, 0, .2), 0 0 0 1px rgba(0, 0, 0, .1)' }}
      />

      <List>
        {
          filteredSrd.map((item, i) => {
            return (
              <Item {...item} index={i} key={item.id} onClick={() => openItem(item)} />
            )
          }).slice(0, 25)
        }
      </List>
      <CustomButton onClick={() => openItem()}>Custom</CustomButton>
    </Container>
  )
}

export default Search;