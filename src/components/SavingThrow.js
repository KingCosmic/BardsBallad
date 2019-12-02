import React, { Component } from 'react';
import styled from 'styled-components';

import T from './Text';

import { determinMod } from '../helpers'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 5px;
  width: 100%;
  margin-top: 5px;
`

const CheckBox = styled.div`
  height: 1.8em;
  width: 1.8em;
  background-color: ${props => props.checked ? props.theme[props.color || 'green'] || props.color : props.theme.grey};
  margin-right: 5px;

  @media only screen and (min-width: 768px) {
    width: 1.5em;
    height: 1.5em;
  }
`

const Text = styled(T)`
  font-size: 1.5em;
  padding: 0 5px;

  @media only screen and (min-width: 768px) {
    font-size: 1.3em;
  }
`

const Value = styled(Text)`
  text-decoration: underline ${props => props.theme.grey};
  margin-right: 5px;
`

class SavingThrow extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    const { characterID, syncData, throws, skill } = this.props;

    syncData(
      characterID,
      {
        [`savingThrows.${skill}`]: !throws[skill]
      }
    )
  }

  render() {
    const { throws, skill, stats, prof } = this.props;

    const efficient = throws[skill]
    const mod = determinMod(stats[skill]);

    return (
      <Container>
        <CheckBox onClick={this.handleChange} checked={efficient} />

        <Value>
          {
            (efficient ? mod + prof : mod) < 0 ? 
              (efficient ? mod + prof : mod) :
              `+${(efficient ? mod + prof : mod) }`
          }
        </Value>

        <Text>{skill || 'saving throw'}</Text>
      </Container>
    )
  }
}

export default SavingThrow;