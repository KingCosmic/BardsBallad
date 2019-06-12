import React, { Component } from 'react';
import styled from 'styled-components';

import Container from '../atoms/Container';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

import merge from 'lodash.merge';

const BackDrop = styled(Container)`
  width: 30%;
  border-radius: 8px;
  background-color: ${props => props.theme.dark};
  box-shadow: 0 2px 10px rgba(0, 0, 0, .2), 0 0 0 1px rgba(28, 36, 43 .6);
  padding: 20px;
`

const Input = styled.input`
  background-color: transparent;
  margin: 0;
  padding: 0;
  outline: none;
  border: none;
  color: ${props => props.theme.text};
  font-size: 0.9em;
  font-family: 'OpenSans';

  &::placeholder {
    color: #8e9297;
  }
`

class EditSpellSlots extends Component {
  constructor(props) {
    super(props);

    console.log(props)

    const { slots, level, update } = props;

    let updateSlots = update.spellSlots || {}

    const { current, max } = merge(slots[level], updateSlots[level] || {})

    this.state = {
      current,
      max
    }

    this.onChange = this.onChange.bind(this);
  }

  onChange(type, value) {
    this.setState({
      [type]: value
    })
  }

  render() {
    const { slots, level, update, goBack, editSlots } = this.props;

    const { current, max } = this.state;

    return (
      <BackDrop onClick={(e) => e.stopPropagation()}>
        <Container height='30px' margin='0 0 10px 0' justifyContent='space-around' direction='row'>
          <Text size='0.9rem' onClick={goBack}>cancel</Text>

          <Title align='center'>Edit level {level} SpellSlots</Title>

          <Text size='0.9rem' onClick={() => editSlots(level, this.state)}>Confirm</Text>
        </Container>
        <Container direction='row'>
          <Container margin='5px 0' width='50%'>
            <Text size='0.8rem' weight='200' color='gold'>Current</Text>

            <Input type='number' value={current} onChange={({ target: { value } }) => this.onChange('current', value)} />
          </Container>
          <Container margin='5px 0' width='50%'>
            <Text size='0.8rem' weight='200' color='gold'>Maximum</Text>

            <Input type='number' value={max} onChange={({ target: { value } }) => this.onChange('max', value)} />
          </Container>
        </Container>
      </BackDrop>
    )
  }
}

export default EditSpellSlots;