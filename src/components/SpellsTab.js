import React, { Component } from 'react';
import styled from 'styled-components';

import merge from 'lodash.merge';

import Container from '../atoms/Container';
import Text from '../atoms/Text';

import List from '../atoms/List';
import Spell from './Spell';
import Search from './Search';
import Button from '../atoms/Button';

import ListSection from './ListSection';

import { mergeUpdates } from '../helpers';

import spells from '../data/spells.json';

const listFilter = (level) => (spell) => spell.level === level

const SlotOption = styled(Text)`
  cursor: pointer;
  background-color: ${props => props.cast ? props.theme.red : props.theme.green};
  border-radius: 4px;
  padding: 0 2px;
  margin-right: 5px;
`

const SpellSlots = ({ slots: { current, max }, onClick, edit, level }) => {
  return (
    <Container direction='row'>
      <SlotOption onClick={() => edit(level, { current: current + 1, max })}>+1</SlotOption>
      <SlotOption onClick={() => edit(level, { current: current - 1, max })} cast>-1</SlotOption>
      <Text onClick={() => onClick(level)}>{current}/{max}</Text>
    </Container>
  )
}

class SpellsTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: ''
    }

    this.onSearch = this.onSearch.bind(this);
  }

  onSearch(event) {
    this.setState({ search: event.target.value })
  }

  render() {
    const {
      char: { spells, spellSlots },
      showAddSpell, showSpellInfo, showEditSpellslots,
      updateSpellslots, data
    } = this.props;
    const { search } = this.state;

    const spellData = mergeUpdates(spells, data.spells || []);

    const slotData = merge(spellSlots, data.spellSlots || {});

    return (
      <Container height='calc(100% - 40px)' width='calc(100% - 40px)' padding='20px' direction='row'>

        <Container width='58.5%'>
          <Search onSearch={this.onSearch} value={search} ph='Search Spells...' />

          <Container flowY='auto' height='calc(90% - 20px)' margin='10px 0'>
            <ListSection title='Cantrips' onClick={(spell) => showSpellInfo(spell.id)} filter={listFilter(0)} data={spellData} Component={Spell} />
            <ListSection title='First Level' onClick={(spell) => showSpellInfo(spell.id)} filter={listFilter(1)} HeaderExtra={() => <SpellSlots slots={slotData.one} onClick={showEditSpellslots} edit={updateSpellslots} level='one' />} data={spellData} Component={Spell} />
            <ListSection title='Second Level' onClick={(spell) => showSpellInfo(spell.id)} filter={listFilter(2)} HeaderExtra={() => <SpellSlots slots={slotData.two} onClick={showEditSpellslots} edit={updateSpellslots} level='two' />} data={spellData} Component={Spell} />
            <ListSection title='Third Level' onClick={(spell) => showSpellInfo(spell.id)} filter={listFilter(3)} HeaderExtra={() => <SpellSlots slots={slotData.three} onClick={showEditSpellslots} edit={updateSpellslots} level='three' />} data={spellData} Component={Spell} />
            <ListSection title='Fourth Level' onClick={(spell) => showSpellInfo(spell.id)} filter={listFilter(4)} HeaderExtra={() => <SpellSlots slots={slotData.four} onClick={showEditSpellslots} edit={updateSpellslots} level='four' />} data={spellData} Component={Spell} />
            <ListSection title='Fifth Level' onClick={(spell) => showSpellInfo(spell.id)} filter={listFilter(5)} HeaderExtra={() => <SpellSlots slots={slotData.five} onClick={showEditSpellslots} edit={updateSpellslots} level='five' />} data={spellData} Component={Spell} />
            <ListSection title='Sixth Level' onClick={(spell) => showSpellInfo(spell.id)} filter={listFilter(6)} HeaderExtra={() => <SpellSlots slots={slotData.six} onClick={showEditSpellslots} edit={updateSpellslots} level='six' />} data={spellData} Component={Spell} />
            <ListSection title='Seventh Level' onClick={(spell) => showSpellInfo(spell.id)} filter={listFilter(7)} HeaderExtra={() => <SpellSlots slots={slotData.seven} onClick={showEditSpellslots} edit={updateSpellslots} level='seven' />} data={spellData} Component={Spell} />
            <ListSection title='Eigth Level' onClick={(spell) => showSpellInfo(spell.id)} filter={listFilter(8)} HeaderExtra={() => <SpellSlots slots={slotData.eight} onClick={showEditSpellslots} edit={updateSpellslots} level='eight' />} data={spellData} Component={Spell} />
            <ListSection title='Nineth Level' onClick={(spell) => showSpellInfo(spell.id)} filter={listFilter(9)} HeaderExtra={() => <SpellSlots slots={slotData.nine} onClick={showEditSpellslots} edit={updateSpellslots} level='nine' />} data={spellData} Component={Spell} />
          </Container>
          <Button onClick={showAddSpell}>Add Spell</Button>
        </Container>
      </Container>
    )
  }
}

export default SpellsTab;