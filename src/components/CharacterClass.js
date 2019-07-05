import React, { Component } from 'react';
import styled from 'styled-components';

import Container from '../atoms/Container';
import Text from '../atoms/Text';

import { getLevel } from '../data/levels';

const Input = styled.input`
  background-color: transparent;
  margin: 0 5px;
  padding: 0;
  outline: none;
  border: none;
  color: ${props => props.theme.text};
  font-size: 1.2vw;
  font-family: 'OpenSans';
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.middleblack};
  }

  &::placeholder {
    color: #8e9297;
  }
`

class CharacterClass extends Component {
  constructor(props) {
    super(props);

    this.path = 'job';

    this.state = {
      value: props.value
    }

    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onChange(event) {
    this.setState({
      value: event.target.value
    })
  }

  onBlur() {
    // only send the action if the state needs to be resaved
    const changed = this.props.data[this.path] ? true : false;

    if (this.state.value === this.props.value && !changed) return;

    if (this.state.value === this.props.value && changed) {
      return this.props.revertData(this.path);
    }

    this.props.updateData(this.path, this.state.value);
  }

  render() {
    const { exp } = this.props;
    const { value } = this.state;

    return (
      <Container alignItems='center' direction='row'>
        <Input value={value} onChange={this.onChange} onBlur={this.onBlur} />
        <Text>level: {getLevel(exp)}</Text>
      </Container>
    )
  }
}

export default CharacterClass;