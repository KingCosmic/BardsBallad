/* eslint eqeqeq: 'off' */

import React, { Component } from 'react';
import styled from 'styled-components';

import I from '../atoms/Input';
import C from '../atoms/Container';
import Text from '../atoms/Text';
import BarContainer from '../atoms/BarContainer';
import BarFiller from '../atoms/BarFiller';

const Container = styled(C)`
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.dark};
    outline: 1px solid ${props => props.theme.almostblack};
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

const determinPercent = (current, max, temp = 0) => `${(current / max) * 100}%`;

class HP extends Component { 
  handleSave() {
    const { data, path, val, updateData, revertData, editItem } = this.props;

    // only send the action if the state needs to be resaved
    const changed = data[path] ? true : false;

    if (this.refs.number.value == val && !changed) return editItem('');

    if (this.refs.number.value == val && changed === true) {
      return revertData(path);
    }

    updateData(path, this.refs.number.value)
  }

  render() {
    const { hp, editing, path, editItem, data } = this.props;

    const { max, current, temp } = data[path] ? Object.assign(hp, data[path]) : hp;

    // check if we're editing this component :D
    if (editing === path) {
      return (
        <C grow='1' justifyContent='space-between' alignItems='center' bg ol>
          <Input type='number' ref='number' defaultValue={current} />
          <Save onClick={this.handleSave}>Save</Save>
        </C>
      )
    } else {
      return (
        <Container grow='1' onClick={() => editItem(path)}>
          <Text size='0.9em' header>HP: {current + temp}/{max}</Text>

          <BarContainer width='100%' height='10px' bg ol>
            <BarFiller width={determinPercent(current + temp, max)} color='blue' />
            <BarFiller width={determinPercent(current, max)} color='green' />
          </BarContainer>
        </Container>
      )
    }
  }
}
export default HP;