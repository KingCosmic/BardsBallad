import React from 'react';

import Container from '../atoms/Container';
import Title from '../atoms/Title';
import List from '../atoms/List';
import SavingThrow from './SavingThrow';

const STR = 'strength'
const DEX = 'dexterity'
const CON = 'constitution'
const INT = 'intelligence'
const WIS = 'wisdom'
const CHA = 'charisma'

const SavingThrows = (props) => {
  const { throws, stats, update, prof } = props

  return (
    <Container height='calc(30% - 10px)' margin='0 0 10px 0' padding='5px'>
      <Title margin='0 0 5px 0' header>Saving Throws</Title>

      <List width='100%'>
        <SavingThrow key='1' value={stats[STR]} skill={STR} efficient={throws[STR]}
          prof={prof} update={update}
        />

        <SavingThrow key='2' value={stats[DEX]} skill={DEX} efficient={throws[DEX]}
          prof={prof} update={update}
        />

        <SavingThrow key='3' value={stats[CON]} skill={CON} efficient={throws[CON]}
          prof={prof} update={update}
        />

        <SavingThrow key='4' value={stats[INT]} skill={INT} efficient={throws[INT]}
          prof={prof} update={update}
        />

        <SavingThrow key='5' value={stats[WIS]} skill={WIS} efficient={throws[WIS]}
          prof={prof} update={update}
        />

        <SavingThrow key='6' value={stats[CHA]} skill={CHA} efficient={throws[CHA]}
          prof={prof} update={update}
        />
      </List>
    </Container>
  )
}

export default SavingThrows;