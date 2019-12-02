import React from 'react';
import styled from 'styled-components';

import T from './Text';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  user-select: none;
`

const Text = styled(T)`
  font-size: 1.4em;
`

const SlotOption = styled(Text)`
  background-color: ${props => props.cast ? props.theme.red : props.theme.green};
  border-radius: 4px;
  padding: 0 2px;
  width: 30px;
  text-align: center;
  margin-right: 5px;
`

const SpellSlots = ({ slots: { current, max }, onClick, edit, level }) => {
  return (
    <Container>
      <SlotOption onClick={() => edit(level, { current: current + 1, max })}>+1</SlotOption>
      <SlotOption onClick={() => edit(level, { current: current - 1, max })} cast>-1</SlotOption>
      <Text onClick={() => onClick(level)}>{current}/{max}</Text>
    </Container>
  )
}

export default SpellSlots;