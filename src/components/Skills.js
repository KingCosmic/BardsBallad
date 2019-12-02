import React from 'react';
import styled from 'styled-components';

import Skill from './Skill';
import Text from './Text';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  width: 100%;
`

const Title = styled(Text)`
  color: ${props => props.theme.gold};
  margin-bottom: 5px;
  font-size: 2em;
  border-bottom: 1px solid ${props => props.theme.gold};
`

const AC = 'acrobatics';
const AH = 'animalHandling';
const AR = 'arcana';
const AT = 'athletics';
const DE = 'deception';
const HI = 'history';
const IN = 'insight';
const INT = 'intimidation';
const INV = 'investigation';
const MED = 'medicine';
const NAT = 'nature';
const PER = 'perception';
const PERF = 'performance';
const PERS = 'persuasion';
const REL = 'religion';
const SOH = 'sleightOfHand';
const STE = 'stealth';
const SUR = 'survival';

const Skills = (props) => {
  return (
    <Container>
      <Title>Skills</Title>

      <Skill key='1' skill={AC} {...props} />
      <Skill key='2' skill={AH} {...props} />
      <Skill key='3' skill={AR} {...props} />
      <Skill key='4' skill={AT} {...props} />
      <Skill key='5' skill={DE} {...props} />
      <Skill key='6' skill={HI} {...props} />
      <Skill key='7' skill={IN} {...props} />
      <Skill key='8' skill={INT} {...props} />
      <Skill key='9' skill={INV} {...props} />
      <Skill key='10' skill={MED} {...props} />
      <Skill key='11' skill={NAT} {...props} />
      <Skill key='12' skill={PER} {...props} />
      <Skill key='13' skill={PERF} {...props} />
      <Skill key='14' skill={PERS} {...props} />
      <Skill key='15' skill={REL} {...props} />
      <Skill key='16' skill={SOH} {...props} />
      <Skill key='17' skill={STE} {...props} />
      <Skill key='18' skill={SUR} {...props} />
    </Container>
  )
}

export default Skills;