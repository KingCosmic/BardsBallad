import React from 'react';

import Container from '../atoms/Container';
import Title from '../atoms/Title';
import List from '../atoms/List';
import Skill from './Skill';

const renderThrows = (throws, stats, data, prof) => {
  let list = [];

  Object.keys(throws).forEach(thr => {
    const path = `savingThrows.${thr}`
    const efficient = typeof data[path] === "boolean" ? data[path] : throws[thr]
    const skill = thr;
    const value = data[`stats.${thr}`] || stats[thr];

    list.push(
      <Skill key={skill} value={value} skill={skill} efficient={efficient} path={path} prof={prof} />
    )
  })

  return list;
}

const SavingThrows = (props) => {
  const { throws, stats, data, prof } = props;

  return (
    <Container height='calc(30% - 20px)' margin='0 0 20px 0' padding='10px'>
      <Title margin='0 0 5px 0' header>Saving Throws</Title>

      <List width='100%'>
        {
          renderThrows(throws, stats, data, prof)
        }
      </List>
    </Container>
  )
}

export default SavingThrows;