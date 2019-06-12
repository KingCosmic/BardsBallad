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

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { path, efficient, wasEfficient } = this.props;

    const newStage = (efficient === 3) ? 0 : efficient + 1

    if (newStage === wasEfficient) {
      return this.props.revertData(path);
    } 

    this.props.updateData(path, newStage);
  }
  
  render() {
    const { efficient, value, skill, stat, prof } = this.props;

    const mod = determinMod(value);

    return (
      <ListItem alignItems='center'>
        <CheckBox onClick={this.handleClick} margin='0 5px 0 0' stage={efficient} />

        <Value size='0.8em' margin='0 5px 0 0'>{modForStage[efficient](mod, prof)}</Value>

        <Text size='0.8em'>{skill}</Text>

        <Text size='0.8em' margin='0 0 0 5px'>({stat})</Text>
      </ListItem>
    )
  }
}

const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, { updateData, revertData })(Skill);