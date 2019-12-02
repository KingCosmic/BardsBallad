import React, { Component } from 'react';

import { connect } from 'react-redux';
import { updateData, revertData } from '../reducers/characters';

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

    const { extraStyles = '' } = this.props;

    return (
      <textarea 
        {...this.props}
        className={`${extraStyles} text-white font-thin border-0 outline-none resize-none bg-transparent hover:bg-dark`}
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