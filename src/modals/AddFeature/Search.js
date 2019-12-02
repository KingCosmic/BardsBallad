import React from 'react';
import styled from 'styled-components';

import Button from '../../components/Button';

import SearchInput from '../../components/Search';
import Feat from '../../components/Feature';

import { typeFilters } from '../../data/constants';

import srdFeatures from '../../data/features.json';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(100% - 60px);
  width: 100%;
  padding: 15px;
`

const List = styled.div`
  overflow-y: auto;
  margin: 10px 0;
`

const CustomButton = styled(Button)`

`

const Search = ({ onSearch, search, filter, changeFilter, openFeat, limit }) => {
  const filteredSrd = srdFeatures.filter(feat => feat.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <Container>
      <SearchInput onSearch={onSearch} value={search} ph='Search Features...' filters={typeFilters} currentFilter={filter} onFilter={changeFilter}
        bgStyle={{ backgroundColor: '#72767D', boxShadow: '0 2px 5px rgba(0, 0, 0, .2), 0 0 0 1px rgba(0, 0, 0, .1)' }}
      />

      <List>
        {
          filteredSrd.map((feat, i) => {
            return (
              <Feat {...feat} index={i} key={feat.id} onClick={() => openFeat(feat)} />
            )
          })
        }
      </List>
      <CustomButton onClick={() => openFeat()}>Custom</CustomButton>
    </Container>
  )
}

export default Search;