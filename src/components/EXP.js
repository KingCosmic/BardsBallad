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

const determinPercent = (current, max) => `${(current / max) * 100}%`;

class EXP extends Component {
  constructor(props) {
    super(props);

    this.handleSave = this.handleSave.bind(this);
  }

  handleSave() {
    const { data, path, exp, updateData, revertData, editItem } = this.props;

    // check to see we arent making unnecesarry saves
    const changed = data[path] ? true : false;

    if (this.refs.exp.value == exp && !changed) return editItem('');

    if (this.refs.exp.value == exp && changed === true) {
      return revertData(path);
    }

    updateData(path, Number(this.refs.exp.value))
  }
  
  render() {
    const { exp, editing, path, editItem, data } = this.props;

    console.log(exp)

    const currentEXP = data[path] !== undefined ? data[path] : exp;

    console.log(currentEXP)

    // check if we're editing this component :D
    if (editing === path) {
      return (
        <C grow='1' justifyContent='space-between' alignItems='center' bg ol>
          <Input type='number' ref='exp' defaultValue={currentEXP} />

          <Save onClick={this.handleSave}>Save</Save>
        </C>
      )
    } else {
      return (
        <Container grow='1' onClick={() => editItem(path)}>
          <Text size='0.9em' header>EXP: {currentEXP}/{300}</Text>
          <BarContainer width='100%' height='10px' bg ol>
            <BarFiller width={determinPercent(currentEXP, 300)} color='gold' />
          </BarContainer>
        </Container>
      )
    }
  }
}

export default EXP;