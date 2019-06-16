/* eslint eqeqeq: 'off' */

import React, { Component } from 'react';
import styled from 'styled-components';

import I from '../atoms/Input';
import C from '../atoms/Container';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

const Container = styled(C)`
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

class PassivePerception extends Component {
  constructor(props) {
    super(props);

    this.handleSave = this.handleSave.bind(this);
  }

  handleSave() {
    const { data, path, value, updateData, revertData, editItem } = this.props;

    // only send the action if the state needs to be resaved
    const changed = data[path] ? true : false;

    if (this.refs.number.value == value && !changed) return editItem('');

    if (this.refs.number.value == value && changed === true) {
      return revertData(path);
    }

    updateData(path, this.refs.number.value)
  }

  render() {
    const { value, editing, path, editItem, data } = this.props;

    // determin passive perception
    const currentValue = data[path] ? data[path] : value;

    // check if we're editing this component :D
    if (editing === path) {
      return (
        <Container width='calc(32% - 10px)' padding='5px' margin='10px 5px 0' justifyContent='space-between' alignItems='center' bg ol>
          <Input type='number' ref='number' defaultValue={currentValue} />
          <Save onClick={this.handleSave}>Save</Save>
        </Container>
      )
    } else {
      return (
        <Container width='calc(32% - 10px)' padding='5px' margin='10px 5px 0' justifyContent='center' alignItems='center' onClick={() => editItem(path)} bg ol>
          <Title size='1.1vw'>Passive</Title>
          <Title size='1.1vw'>Perception</Title>
          <Text margin='5px 0' header>{currentValue}</Text>
        </Container>
      )
    }
  }
}

export default PassivePerception;