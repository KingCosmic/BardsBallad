import React, { Component } from 'react';
import styled from 'styled-components';

import ListItem from '../atoms/ListItem';
import CB from '../atoms/CheckBox';
import Text from '../atoms/Text';

import { connect } from 'react-redux';
import { updateData, revertData } from '../reducers/update';

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

const stageMap = { 0: 'grey', 1: 'blue', 2: 'green', 3: 'gold' }

const CheckBox = styled(CB)`
  background-color: ${props => props.theme[stageMap[props.stage]]};

  &:hover {
    background-color: ${props => props.theme[stageMap[props.stage + 1]] || 'none'};
  }
`

const Value = styled(Text)`
  text-decoration: underline ${props => props.theme.grey};
`

class Skill extends Component {
  constructor(props) {
    super(props);

    const { update, efficient, skill } = props;

    this.path = `skills.${skill}`;

    this.state = {
      efficient: typeof update[this.path] === 'number' ? update[this.path] : efficient
    }

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { revertData, updateData } = this.props;
    const { efficient } = this.state;

    const newStage = (efficient === 3) ? 0 : efficient + 1

    this.setState({
      efficient: newStage
    }, () => {
      if (newStage === this.props.efficient) {
        return revertData(this.path);
      }

      updateData(this.path, newStage);
    })
  }
  
  render() {
    const { stats, skill, stat, prof, update } = this.props;
    const { efficient } = this.state;

    const value = update[`stats.${stat}`] || stats[stat];

    const mod = determinMod(value);

    return (
      <ListItem alignItems='center'>
        <CheckBox onClick={this.handleClick} margin='0 5px 0 0' stage={efficient} />

        <Value size='0.8em' margin='0 5px 0 0'>{modForStage[efficient](mod, prof)}</Value>

        <Text size='0.8em'>{skillMap[skill] || skill}</Text>

        <Text size='0.8em' margin='0 0 0 5px'>({stat})</Text>
      </ListItem>
    )
  }
}

const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, { updateData, revertData })(Skill);