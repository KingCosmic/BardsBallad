/* eslint eqeqeq: 'off' */

import React, { Component } from 'react';
import styled from 'styled-components';

import GridItem from '../atoms/GridItem';
import I from '../atoms/Input';
import C from '../atoms/Container';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

const Container = styled(GridItem)`
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.almostblack};
  }
`

const Input = styled(I)`
  outline: none;
  border: none;
  background-color: ${props => props.theme.dark};
  color: ${props => props.theme.text};
  margin: 1px;
  width: 100%;
  text-align: center;

  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`

const Save = styled(C)`
  color: ${props => props.theme.text};
  background-color: ${props => props.theme.green};
  margin: 1px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: calc(100% - 10px);
  padding: 5px;
`

class Speed extends Component { 
  constructor(props) {
    super(props);

    this.handleSave = this.handleSave.bind(this);
  }

  handleSave() {
    const { data, path, speed, updateData, revertData, editItem } = this.props;

    // only send the action if the state needs to be resaved
    const changed = data[path] ? true : false;

    if (this.refs.number.value == speed && !changed) return editItem('');

    if (this.refs.number.value == speed && changed === true) {
      return revertData(path);
    }

    updateData(path, this.refs.number.value)
  }

  render() {
    const { speed, editing, path, editItem, data } = this.props;
  
    const currentSpeed = data[path] || speed;

    // check if we're editing this component :D
    if (editing === path) {
      return (
        <GridItem height='90px' column='auto / span 4' justifyContent='space-between' alignItems='center' bg ol>
          <Input type='number' ref='number' defaultValue={currentSpeed} />
          <Save onClick={this.handleSave}>Save</Save>
        </GridItem>
      )
    } else {
      return (
        <Container height='90px' column='auto / span 4' justifyContent='center' alignItems='center' onClick={() => editItem(path)} bg ol>
          <Title header>Speed</Title>
          <Text margin='5px 0' header>{currentSpeed}</Text>
        </Container>
      )
    }
  }
}

export default Speed;