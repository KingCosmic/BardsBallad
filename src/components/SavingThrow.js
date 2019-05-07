import React, { Component } from 'react';
import styled from 'styled-components';

import ListItem from '../atoms/ListItem';
import CheckBox from '../atoms/CheckBox';
import Text from '../atoms/Text';

import { connect } from 'react-redux';
import { updateData, revertData } from '../reducers/characters';

import { determinMod } from '../helpers'

const Value = styled(Text)`
  text-decoration: underline ${props => props.theme.grey};
`

class SavingThrow extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { path, efficient, wasEfficient } = this.props;

    if (efficient !== wasEfficient) {
      return this.props.revertData(path);
    }

    this.props.updateData(path, !efficient);
  }

  render() {
    const { efficient, value, skill, prof } = this.props;

    const mod = determinMod(value);

    return (
      <ListItem alignItems='center'>
        <CheckBox onClick={this.handleClick} margin='0 5px 0 0' checked={efficient} />

        <Value size='0.8em' margin='0 5px 0 0'>{efficient ? mod + prof : mod}</Value>

        <Text size='0.8em'>{skill}</Text>
      </ListItem>
    )
  }
}

const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, { updateData, revertData })(SavingThrow);