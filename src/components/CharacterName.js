import React, { Component } from 'react';
import styled from 'styled-components';

const Input = styled.input`
  background-color: transparent;
  margin: 0 5px;
  padding: 0;
  outline: none;
  border: none;
  color: ${props => props.theme.gold};
  font-size: 1.4vw;
  font-family: 'OpenSans';
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.middleblack};
  }

  &::placeholder {
    color: #8e9297;
  }
`

class CharacterName extends Component {
  constructor(props) {
    super(props);

    this.path = 'name';

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
    const { value } = this.state;

    return (
      <Input value={value} onChange={this.onChange} onBlur={this.onBlur} />
    )
  }
}

export default CharacterName;