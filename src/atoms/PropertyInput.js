import React, { Component } from 'react';

import Container from './Container';
import Input from './Input';

import OnEvent from 'react-onevent';

class TagInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
      tags: []
    }
  }

  addTag(tag) {
    tag = tag.trim();

    if (!(this.state.tags.indexOf(tag) > -1)) {
      let tags = this.state.tags.concat([tag])
      this.setState({ tags })
    }

    this.setState({
      inputValue: ''
    })
  }

  removeTag(removeTag) {
    let tags = this.state.tags.filter(tag => tag !== removeTag)
    this.setState({ tags })
  }

  render() {
    const { inputValue, tags } = this.state;

    return (
      <Container>
        <OnEvent enter={e => this.addTag(e.target.value)}>
          <Input placeholder='Seperate tags by enter'
            value={inputValue} onChange={e => this.setState({ inputValue: e.target.value })}
          />
        </OnEvent>
        <Container direction='row'>
          {tags && tags.map((tag, index) => <Container key={index} onClick={() => this.removeTag(tag)}>{tag}</Container>)}
        </Container>
      </Container>
    )
  }
}

export default TagInput;