import React, { Component } from 'react';
import styled from 'styled-components';

import ListItem from '../atoms/ListItem';
import CheckBox from '../atoms/CheckBox';
import Text from '../atoms/Text';

import { connect } from 'react-redux';
import { updateData, revertData } from '../reducers/update';

import { determinMod } from '../helpers'

const Value = styled(Text)`
  text-decoration: underline ${props => props.theme.grey};
`

class SavingThrow extends Component {
  constructor(props) {
    super(props);

    const { update, efficient, skill } = props;

    this.path = `savingThrows.${skill}`;

    this.state = {
      efficient: typeof update[this.path] === 'boolean' ? update[this.path] : efficient
    }

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { revertData, updateData } = this.props;
    const { efficient } = this.state;

    this.setState({
      efficient: !efficient
    }, () => {
      if (efficient !== this.props.efficient) {
        return revertData(this.path);
      }

      updateData(this.path, !efficient);
    })
  }

  render() {
    const { value, skill, prof } = this.props;
    const { efficient } = this.state;

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