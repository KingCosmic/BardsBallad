import React from 'react';

import Container from '../atoms/Container';
import Title from '../atoms/Title';
import List from '../atoms/List';
import Skill from './Skill';

const renderSkills = (skills) =>
  skills.map(skill => <Skill value={skill.value} skill={skill.skill} stat={skill.stat} efficient={skill.efficient} />)

const Skills = (props) => {
  return (
    <Container height='70%' padding='10px' alignItems='center' bg>
      <Title margin='0 0 5px 0'>Skills</Title>

      <List flowY='scroll' width='100%' barWidth='0px'>
        {
          renderSkills([
            {
              value: 1,
              efficient: false,
              skill: 'acrobatics',
              stat: 'Dex'
            },{
              value: 3,
              efficient: false,
              skill: 'animal handling',
              stat: 'Wis'
            },{
              value: 2,
              efficient: false,
              skill: 'acana',
              stat: 'Int'
            },{
              value: 8,
              efficient: true,
              skill: 'athletics',
              stat: 'Str'
            },{
              value: 2,
              efficient: false,
              skill: 'deception',
              stat: 'Cha'
            },{
              value: 2,
              efficient: false,
              skill: 'history',
              stat: 'Int'
            },{
              value: 3,
              efficient: false,
              skill: 'insight',
              stat: 'Wis'
            },{
              value: 5,
              efficient: true,
              skill: 'intimidation',
              stat: 'Cha'
            },{
              value: 2,
              efficient: false,
              skill: 'investigation',
              stat: 'Int'
            },{
              value: 6,
              efficient: true,
              skill: 'medicine',
              stat: 'Wis'
            },{
              value: 2,
              efficient: false,
              skill: 'nature',
              stat: 'Int'
            },{
              value: 6,
              efficient: true,
              skill: 'perception',
              stat: 'Wis'
            },{
              value: 2,
              efficient: false,
              skill: 'performance',
              stat: 'Cha'
            },{
              value: 5,
              efficient: true,
              skill: 'persuasion',
              stat: 'Cha'
            },{
              value: 2,
              efficient: false,
              skill: 'religion',
              stat: 'Int'
            },{
              value: 1,
              efficient: false,
              skill: 'sleight of hand',
              stat: 'Dex'
            },{
              value: 3,
              efficient: false,
              skill: 'stealth',
              stat: 'Dex'
            },{
              value: 3,
              efficient: false,
              skill: 'survival',
              stat: 'Wis'
            },
          ])
        }
      </List>
    </Container>
  )
}

export default Skills;