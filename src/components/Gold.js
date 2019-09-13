import React, { Component } from 'react';
import styled from 'styled-components';

import C from '../atoms/Container';
import Title from '../atoms/Title';

const Container = styled(C)`
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.almostblack};
  }
`

const Input = styled.input`
  width: 100%;
  background-color: transparent;
  margin: 0;
  padding: 0;
  outline: none;
  border: none;
  color: ${props => props.theme.text};
  font-size: 1.25vw;
  font-family: 'OpenSans';
  cursor: pointer;

  &::placeholder {
    color: #8e9297;
  }
`

class Gold extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.update[props.path] || props.amount
    }

    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    const value = event.target.value;

    this.setState({
      value: value
    }, () => {
      // only send the action if the state needs to be resaved
      const changed = this.props.update[this.props.path] ? true : false;

      if (this.state.value === this.props.value && !changed) return;

      if (this.state.value === this.props.value && changed) {
        return this.props.revertData(this.props.path);
      }

      this.props.updateData(this.props.path, this.state.value);
    })
  }

  render() {
    const { type } = this.props;
    const { value } = this.state;

    return (
      <Container margin='5px' padding='5px' direction='row' bg ol hover>
        <Title margin='0 10px 0 0'>{type}</Title>
        <Input value={value} onChange={this.onChange} type='number' />
      </Container>
    )
  }
}

export default Gold;