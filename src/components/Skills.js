import React from 'react';

import Container from '../atoms/Container';
import Title from '../atoms/Title';
import List from '../atoms/List';
import Skill from './Skill';

import { skillToStat } from '../data/skills';

const renderSkills = (skills, stats, data, prof) => {
  let list = [];

  // convert our object to the keys since we need them
  Object.keys(skills).forEach(skill => {
    const path = `skills.${skill}`

    // checks if we're efficient
    const efficient = typeof data[path] === "boolean" ? data[path] : skills[skill]

    // get what stat is bound to this skill
    const stat = skillToStat(skill)

    // check if what our stat value is for that skill (helper function)
    const value = data[`stats.${stat}`] || stats[stat];

    // add it to the list
    list.push(
      <Skill
        key={skill} value={value} skill={skill} stat={stat} efficient={efficient}
        path={path} prof={prof}
      />
    )
  })

  return list;
}

const Skills = (props) => {
  const { skills, stats, data, prof } = props;

  return (
    <Container height='calc(70% - 20px)' padding='10px'>
      <Title margin='0 0 5px 0' header>Skills</Title>

      <List flowY='scroll' width='100%' barWidth='0px'>
        {
          renderSkills(skills, stats, data, prof)
        }
      </List>
    </Container>
  )
}

export default Skills;