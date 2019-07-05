import React from 'react';
import styled from 'styled-components';

import Container from '../atoms/Container';
import List from '../atoms/List';
import ListItem from '../atoms/ListItem';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

import { determinMod } from '../helpers'

const checkProficient = (skill, data, skills) =>
  typeof data[`skills.${skill}`] === "boolean" ? data[`skills.${skill}`] : skills[skill]

const checkStat = (stat, data, stats) =>
  data[`stats.${stat}`] ? data[`stats.${stat}`] : stats[stat];

const Value = styled(Text)`
  text-decoration: underline ${props => props.theme.grey};
`

const Sense = ({ skill, mod, proficient, prof, stat }) => (
  <ListItem alignItems='center'>
    <Value size='0.8em' margin='0 5px 0 0'>{10 + (proficient ? mod + prof : mod)}</Value>

    <Text size='0.8em'>passive {skill}</Text>

    {
      (skill) ? <Text size='0.8em' margin='0 0 0 5px'>({skill})</Text> : null
    }
  </ListItem>
)

const Senses = (props) => {
  const { skills, stats, data, prof } = props;

  const wisdom = checkStat('wisdom', data, stats);
  const intelligence = checkStat('intelligence', data, stats);
  const perception = checkProficient('perception', data, skills);
  const investigation = checkProficient('investigation', data, skills);
  const insight = checkProficient('insight', data, skills);

  return (
    <Container height='calc(30% - 10px)' margin='0 0 10px 0' padding='5px'hover>
      <Title margin='0 0 5px 0' header>Senses</Title>

      <List width='100%'>
        <Sense skill='perception' stat='wis' mod={determinMod(wisdom)} proficient={perception} prof={prof} />
        <Sense skill='investigation' stat='int' mod={determinMod(intelligence)} proficient={investigation} prof={prof} />
        <Sense skill='insight' stat='wis' mod={determinMod(wisdom)} proficient={insight} prof={prof} />
      </List>
    </Container>
  )
}

export default Senses;