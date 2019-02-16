import React, { Component } from 'react';
import styled, { css } from 'styled-components';

import { connect } from 'react-redux';
import { updateData, revertData } from '../reducers/characters';

const TextArea = styled.textarea`
  color: ${props => props.theme[props.color] || props.theme.text};
  ${props => props.align && css` text-align: ${props => props.align}; `} 
  font-size: 0.8em;
  font-weight: 500;

  margin: ${props => props.margin || 0};

  display: flex;
  flex-grow: 1;
  border-style: none;
  outline: none;
  resize: none;
  cursor: pointer;

  background-color: ${props => props.changed ? props.theme.green : 'transparent'};

  &:hover {
    background-color: ${props => props.theme.dark}
  }
`

class InlineEdit extends Component {
  constructor(props) {
    super(props);

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
    const changed = this.props.data[this.props.path] ? true : false;

    if (this.state.value === this.props.value && !changed) return;

    if (this.state.value === this.props.value && changed) {
      return this.props.revertData(this.props.path);
    } 

    this.props.updateData(this.props.path, this.state.value);
  }

  render() {
    const changed = this.props.data[this.props.path] ? true : false;

    return (
      <TextArea {...this.props}
        value={this.state.value}
        onChange={this.onChange}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        changed={changed}
      />
    )
  }
}

const mapStateToProps = (state) => {
  const { data } = state.characters.update

  return {
    data
  }
}

export default connect(mapStateToProps, { updateData, revertData })(InlineEdit);