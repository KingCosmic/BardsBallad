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

const determinPercent = (current, max, temp = 0) => ((current + temp) / max) * 100;

class HP extends Component { 
  constructor(props) {
    super(props);

    this.handleSave = this.handleSave.bind(this);
  }

  handleSave() {
    const { path, updateData } = this.props;

    // TODO: check hp for changes so we dont save if it's
    // unnecesary

    /*
    const changed = data[path] ? true : false;

    if (this.refs.current.value == val && !changed) return editItem('');

    if (this.refs.current.value == val && changed === true) {
      return revertData(path);
    }
    */

    updateData(path, {
      current: Number(this.refs.current.value),
      max: Number(this.refs.max.value),
      temp: Number(this.refs.temp.value)
    })
  }

  render() {
    const { hp, editing, path, editItem, data } = this.props;

    const { current, max, temp } = data[path] ? Object.assign(hp, data[path]) : hp;

    const tempRender = determinPercent(current, max, temp);
    const hpRender = determinPercent(current, max);

    console.log(tempRender)

    // check if we're editing this component :D
    if (editing === path) {
      return (
        <C grow='1' justifyContent='space-between' alignItems='center' bg ol>
          <C direction='row' justifyContent='space-between'>
            <Input type='number' ref='current' defaultValue={current} />
            <Input type='number' ref='max' defaultValue={max} />
            <Input type='number' ref='temp' defaultValue={temp} />
          </C>
          <Save onClick={this.handleSave}>Save</Save>
        </C>
      )
    } else {
      return (
        <Container onClick={() => editItem(path)}>
          <Text size='0.9em' header>HP: {current}/{max} {(temp) ?  ` (+${temp})` : ''}</Text>

          <BarContainer width='100%' height='10px' bg ol>
            <BarFiller width={tempRender > 100 ? '100%' : `${tempRender}%`} color='blue' />
            <BarFiller width={hpRender > 100 ? '100%' : `${hpRender}%`} color='green' />
          </BarContainer>
        </Container>
      )
    }
  }
}
export default HP;