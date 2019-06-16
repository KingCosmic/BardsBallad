import React from 'react';

import Container from '../../atoms/Container';
import Button from '../../atoms/Button';

import ListSection from '../ListSection';
import SearchInput from '../Search';
import Spell from '../Spell';

import { schoolFilters } from '../../data/constants';

import SrdSpells from '../../data/spells.json';

const listFilter = (level) => (spell) => spell.level === level

const Search = ({ onSearch, search, filter, changeFilter, openSpell, limit }) => {

  const filteredSrd = SrdSpells.filter(spell => spell.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <Container height='100%' width='100%'>
      <SearchInput onSearch={onSearch} value={search} ph='Search Spells...' filters={schoolFilters} currentFilter={filter} onFilter={changeFilter}
        bgStyle={{ backgroundColor: '#72767D', boxShadow: '0 2px 5px rgba(0, 0, 0, .2), 0 0 0 1px rgba(0, 0, 0, .1)' }}
      />

      <Container flowY='auto' height='85%' margin='10px 0'>
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
      </Container>
      <Button onClick={() => openSpell(null, true)}>Custom</Button>
    </Container>
  )
}

export default Search;