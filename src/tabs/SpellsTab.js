import React, { Component } from 'react';
import styled from 'styled-components';

import ListSection from '../components/ListSection';
import SpellSlots from '../components/SpellSlots';
import Spell from '../components/Spell';
import Text from '../components/Text';

import AddSpellModal from '../modals/AddSpell';
import SpellInfoModal from '../modals/SpellInfo';

import { merge } from '../helpers';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 15px;
  padding-top: 70px;
  overflow-y: auto;

  @media only screen and (min-width: 768px) {
    padding: 5px;
  }
`

const EmptyText = styled(Text)`
  font-size: 2em;
  display: ${props => props.empty ? 'block' : 'none'};
`

const ListContainer = styled.div`

`

const AddSpell = styled(Text)`
  color: ${props => props.theme.text};
  background-color: ${props => props.theme.green};
  position: fixed;
  bottom: 70px;
  right: 20px;
  font-size: 2em;
  padding: 7px 19px;
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, .2), 0 0 0 1px rgba(0, 0, 0, .1);

  @media only screen and (min-width: 768px) {
    right: 50%;
    bottom: 20px;
  }
`

const listFilter = (level) => (spell) => spell.level === level

class SpellsTab extends Component {
  constructor(props) {
    super(props);

    this.updateSpellslots = this.updateSpellslots.bind(this);
  }

  updateSpellslots(level, slots) {
    const { char: { _id, spellSlots }, syncData } = this.props;

    syncData(
      _id,
      {
        spellSlots: merge(spellSlots, { [level]: slots })
      }
    )
  }

  render() {
    const {
      char: { spells, spellSlots, _id },
      syncData, openModal, closeModal
    } = this.props;

    const extraProps = { onClick: (spell) => openModal({
      id: 'spellinfomodal',
      type: 'custom',
      closeModal: () => closeModal({ id: 'spellinfomodal' }),
      content: <SpellInfoModal characterID={_id} spells={spells} spellID={spell.id} syncData={syncData} requestClose={() => closeModal({ id: 'spellinfomodal' })} />
    }), data: spells, Component: Spell }

    return (
      <Container>
        <EmptyText empty={spells.length === 0}>
          Looks like you don't have any spells, try adding some :(
        </EmptyText>

        <ListContainer>
          <ListSection title='Cantrips' filter={listFilter(0)} {...extraProps} />
          <ListSection title='First Level' filter={listFilter(1)} HeaderExtra={() => <SpellSlots slots={spellSlots.one} onClick={() => { }} edit={this.updateSpellslots} level='one' />} {...extraProps} />
          <ListSection title='Second Level' filter={listFilter(2)} HeaderExtra={() => <SpellSlots slots={spellSlots.two} onClick={() => { }} edit={this.updateSpellslots} level='two' />} {...extraProps} />
          <ListSection title='Third Level' filter={listFilter(3)} HeaderExtra={() => <SpellSlots slots={spellSlots.three} onClick={() => { }} edit={this.updateSpellslots} level='three' />} {...extraProps} />
          <ListSection title='Fourth Level' filter={listFilter(4)} HeaderExtra={() => <SpellSlots slots={spellSlots.four} onClick={() => { }} edit={this.updateSpellslots} level='four' />} {...extraProps} />
          <ListSection title='Fifth Level' filter={listFilter(5)} HeaderExtra={() => <SpellSlots slots={spellSlots.five} onClick={() => { }} edit={this.updateSpellslots} level='five' />} {...extraProps} />
          <ListSection title='Sixth Level' filter={listFilter(6)} HeaderExtra={() => <SpellSlots slots={spellSlots.six} onClick={() => { }} edit={this.updateSpellslots} level='six' />} {...extraProps} />
          <ListSection title='Seventh Level' filter={listFilter(7)} HeaderExtra={() => <SpellSlots slots={spellSlots.seven} onClick={() => { }} edit={this.updateSpellslots} level='seven' />} {...extraProps} />
          <ListSection title='Eigth Level' filter={listFilter(8)} HeaderExtra={() => <SpellSlots slots={spellSlots.eight} onClick={() => { }} edit={this.updateSpellslots} level='eight' />} {...extraProps} />
          <ListSection title='Nineth Level' filter={listFilter(9)} HeaderExtra={() => <SpellSlots slots={spellSlots.nine} onClick={() => { }} edit={this.updateSpellslots} level='nine' />} {...extraProps} />
        </ListContainer>

        <AddSpell onClick={() => openModal({
          id: 'spelladdmodal',
          type: 'custom',
          content: <AddSpellModal spells={spells} characterID={_id} requestClose={() => closeModal({ id: 'spelladdmodal' })} syncData={syncData} />
        })}>&#43;</AddSpell>
      </Container>
    )
  }
}

export default SpellsTab;