import React from 'react';

import Container from '../../atoms/Container';
import SearchInput from '../Search';
import List from '../../atoms/List';
import Feat from '../Feat';
import Button from '../../atoms/Button';

import { typeFilters } from '../../data/constants';

import SrdFeats from '../../data/feats.json';

const Search = ({ onSearch, search, openFeat, limit, onFilter, currentFilter }) => {
  return (
    <Container height='100%' width='100%'>
      <SearchInput onSearch={onSearch} value={search} ph='Search Feats...' onFilter={onFilter}
        currentFilter={currentFilter} filters={typeFilters}
        bgStyle={{ backgroundColor: '#72767D', boxShadow: '0 2px 5px rgba(0, 0, 0, .2), 0 0 0 1px rgba(0, 0, 0, .1)' }}
      />

      <Container flowY='auto' height='85%' margin='10px 0'>
        <List>
          {
            SrdFeats.filter(item => currentFilter === 'ALL' ? true : item.category === currentFilter).filter(item => item.name.toLowerCase().includes(search.toLowerCase())).slice(0, limit)
              .map((feat, i) => (
                <Feat {...feat} index={i} key={feat.id} onClick={() => openFeat(feat)} showRequirements />
              ))
          }
        </List>
      </Container>
      <Button onClick={openFeat}>Custom</Button>
    </Container>
  )
}

export default Search;