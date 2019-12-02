import React, { Component } from 'react';
import styled from 'styled-components';

import T from './Text';

import SelectProficiency from '../modals/SelectProficiency';

import { skillToStat } from '../data/skills';
import { determinMod } from '../helpers'

const modForStage = {
  0: (mod) => mod,
  1: (mod, prof) => mod + Math.floor((prof / 2)),
  2: (mod, prof) => mod + prof,
  3: (mod, prof) => mod + (prof * 2)
}

const skillMap = {
  'animalHandling': 'animal handling',
  'sleightOfHand': 'sleight of hand'
}

const stageMap = { 1: 'blue', 2: 'green', 3: 'gold' }

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 5px;
  margin-top: 5px;
`

const CheckBox = styled.div`
  height: 1.8em;
  width: 1.8em;
  background-color: ${props => props.checked ? props.theme[props.color || 'green'] || props.color : props.theme.grey};
  margin-right: 5px;

  @media only screen and (min-width: 768px) {
    width: 1.5em;
    height: 1.5em;
  }
`

const Text = styled(T)`
  font-size: 1.5em;
  padding: 0 5px;

  @media only screen and (min-width: 768px) {
    font-size: 1.3em;
  }
`

const Value = styled(Text)`
  text-decoration: underline ${props => props.theme.grey};
  margin-right: 5px;
`

class Skill extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { characterID, openModal, closeModal, syncData, skills, skill } = this.props;

    openModal({
      id: 'selectproficiencymodal',
      type: 'custom',
      content: <SelectProficiency title={skillMap[skill] || skill} characterID={characterID} efficient={skills[skill]} skills={skills} skill={skill} syncData={syncData} requestClose={() => closeModal({ id: 'selectproficiencymodal' })} />
    })
  }
  
  render() {
    const { stats, skills, skill, prof } = this.props;

    const efficient = skills[skill]

    const value = stats[skillToStat(skill)];

    const mod = determinMod(value);

    return (
      <Container>
        <CheckBox onClick={this.handleClick} checked={efficient !== 0} color={stageMap[efficient]} />

        <Value>
          {
            modForStage[efficient](mod, prof) < 0 ?
              modForStage[efficient](mod, prof) :
              `+${modForStage[efficient](mod, prof)}`
          }  
        </Value>

        <Text>{skillMap[skill] || skill}</Text>
      </Container>
    )
  }
}

export default Skill;