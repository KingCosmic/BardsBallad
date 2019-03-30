import React, { Component } from 'react';

import Container from '../atoms/Container';
import Text from '../atoms/Text';

import SpellInfo from './SpellInfo';
import SpellList from './SpellList';

import { mergeUpdates } from '../helpers';
import InlineEdit from '../atoms/InlineEdit';

class SpellsTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSpell: '',
      editing: false
    }

    this.changeSpell = this.changeSpell.bind(this);
    this.editSpell = this.editSpell.bind(this);
  }

  changeSpell(id) {
    this.setState({
      currentSpell: id,
      editing: false
    })
  }

  editSpell() {
    this.setState({
      editing: true
    })
  }

  render() {
    const { char: { spells, spellSlots }, addSpell, data } = this.props;
    const { currentSpell, editing } = this.state;

    const spellData = mergeUpdates(spells, data.spells || []);

    const spell = currentSpell === '' ? spellData[0] : spellData.find(spell => spell.id === currentSpell);

    return (
      <Container height='calc(100% - 30px)' width='100%' padding='15px' justifyContent='space-between'>
        <Container height='90%' width='100%' direction='row' bg>

          <SpellList changeSpell={this.changeSpell} spells={spellData} spell={spell} slots={spellSlots} addSpell={addSpell} />

          <SpellInfo spell={spell || {}} editing={editing} editSpell={this.editSpell} />
        </Container>

        <Container direction='row' justifyContent='space-evenly' alignItems='center'>
          <Container>
            <InlineEdit placeholder='wizard' path='castingClass' value={'WIZARD'} noGrow/>
            <Text>CLASS</Text>
          </Container>
          <Container>
            <InlineEdit placeholder='INT' path='castingAbility' value={'INT'} noGrow/>
            <Text>ABILITY</Text>
          </Container>
          <Container>
            <InlineEdit placeholder='15' path='castingDC' value={15} noGrow/>
            <Text>DC</Text>
          </Container>
          <Container>
            <InlineEdit placeholder='7' path='castingBonus' value={7} align='center' noGrow/>
            <Text align='center'>BONUS</Text>
          </Container>
        </Container>
      </Container>
    )
  }
}

export default SpellsTab;