import React from 'react';
import styled from 'styled-components';

import Button from '../../components/Button';

import ListSection from '../../components/ListSection';
import SearchInput from '../../components/Search';
import Spell from '../../components/Spell';

import { schoolFilters } from '../../data/constants';

import srdSpells from '../../data/spells.json';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(100% - 60px);
  width: 100%;
  padding: 15px;

  @media only screen and (min-width: 768px) {
    height: 100%;
  }
`

const List = styled.div`
  overflow-y: auto;
  margin: 10px 0;
`

const CustomButton = styled(Button)`

`

const listFilter = (level) => (spell) => spell.level === level

const Search = ({ onSearch, search, filter, changeFilter, openSpell, limit }) => {

  const filteredSrd = srdSpells.filter(spell => spell.name.toLowerCase().includes(search.toLowerCase())).slice(0, 25)

  return (
    <Container>
      <SearchInput onSearch={onSearch} value={search} ph='Search Spells...' filters={schoolFilters} currentFilter={filter} onFilter={changeFilter}
        bgStyle={{ backgroundColor: '#72767D', boxShadow: '0 2px 5px rgba(0, 0, 0, .2), 0 0 0 1px rgba(0, 0, 0, .1)' }}
      />

      <List>
        <ListSection title='Cantrips' headerColor='dark' data={filteredSrd} filter={listFilter(0)} Component={Spell} onClick={openSpell} />
        <ListSection title='First Level' headerColor='dark' data={filteredSrd} filter={listFilter(1)} Component={Spell} onClick={openSpell} />
        <ListSection title='Second Level' headerColor='dark' data={filteredSrd} filter={listFilter(2)} Component={Spell} onClick={openSpell} />
        <ListSection title='Third Level' headerColor='dark' data={filteredSrd} filter={listFilter(3)} Component={Spell} onClick={openSpell} />
        <ListSection title='Fourth Level' headerColor='dark' data={filteredSrd} filter={listFilter(4)} Component={Spell} onClick={openSpell} />
        <ListSection title='Fifth Level' headerColor='dark' data={filteredSrd} filter={listFilter(5)} Component={Spell} onClick={openSpell} />
        <ListSection title='Sixth Level' headerColor='dark' data={filteredSrd} filter={listFilter(6)} Component={Spell} onClick={openSpell} />
        <ListSection title='Seventh Level' headerColor='dark' data={filteredSrd} filter={listFilter(7)} Component={Spell} onClick={openSpell} />
        <ListSection title='Eigth Level' headerColor='dark' data={filteredSrd} filter={listFilter(8)} Component={Spell} onClick={openSpell} />
        <ListSection title='Nineth Level' headerColor='dark' data={filteredSrd} filter={listFilter(9)} Component={Spell} onClick={openSpell} />
      </List>
      <CustomButton onClick={() => openSpell()}>Custom</CustomButton>
    </Container>
  )
}

export default Search;