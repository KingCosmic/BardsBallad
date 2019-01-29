import React from 'react';
import styled from 'styled-components';

import ListItem from '../atoms/ListItem';
import CheckBox from '../atoms/CheckBox';
import Text from '../atoms/Text';

const Value = styled(Text)`
  text-decoration: underline ${props => props.theme.grey};
`

const Skill = (props) => {
  return (
    <ListItem alignItems='center'>
      <CheckBox margin='0 5px 0 0' checked={props.efficient}/>

      <Value size='0.8em' margin='0 5px 0 0'>{props.value}</Value>

      <Text size='0.8em'>{props.skill}</Text>

      {
        (props.stat) ? <Text size='0.8em' margin='0 0 0 5px'>({props.stat})</Text> : null
      }
    </ListItem>
  )
}

export default Skill;