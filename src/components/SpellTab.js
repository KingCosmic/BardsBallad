import React from 'react';
import styled, { css } from 'styled-components';

import Container from '../atoms/Container';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

const Level = styled(Container)`
  &:hover {
    background-color: ${props => props.theme.middleblack};
  }

  ${props => props.active && css`
    background-color: ${props => props.theme.middleblack};
  `}
`

const SpellTab = (props) => {
  return (
    <Level direction='row' width='9em' padding='5px' justifyContent='space-evenly' bg>
      <Title alignSelf='flex-start'>{props.section}</Title>
        
      {
        
        (props.section !== 0) ? <Text>{props.usesLeft}/{props.maxUses}</Text>

        : <Text>CANTRIPS</Text>

      }

      <Text>{props.spellAmount}</Text>
    </Level>
  )
}

export default SpellTab;