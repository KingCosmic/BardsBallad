import React, { Component } from 'react';
import styled from 'styled-components';

import Container from '../atoms/Container';
import Title from '../atoms/Title';
import Text from '../atoms/Text';
import List from '../atoms/List';
import ListItem from '../atoms/ListItem';

const TextArea = styled.textarea`
  color: ${props => props.theme.text};
  width: 100%;
  min-height: 50px;
  height: auto;
  max-height: 150px;
  font-size: 0.9em;
  font-weight: 100;

  margin: 0;

  border-style: none;
  outline: none;
  resize: none;

  background-color: transparent;

  &::placeholder {
    color: rgba(255, 255, 255, .6);
  }
`

class Proficiency extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.update[props.path] || props.value
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
    const changed = this.props.update[this.props.path] ? true : false;

    if (this.state.value === this.props.value && !changed) return;

    if (this.state.value === this.props.value && changed) {
      return this.props.revertData(this.props.path);
    }

    this.props.updateData(this.props.path, this.state.value);
  }

  render() {
    const { title, ph } = this.props;
    const { value } = this.state;

    return (
      <ListItem direction='column' minHeight='100px' margin='5px 0' hover>
        <Title size='0.9em'>{title}</Title>
        <TextArea placeholder={ph} value={value} onChange={this.onChange} onBlur={this.onBlur} />
      </ListItem>
    )
  }
}

const Proficiencies = ({ armorProfs, weaponProfs, toolProfs, update, updateData, revertData }) => {

  return (
    <Container height='calc(70% - 20px)' padding='10px'>
      <Proficiency title='Armor Proficiencies' ph='Heavy Armor, Leather Armor' value={armorProfs} path='armorProfs' update={update} updateData={updateData} revertData={revertData} />
      <Proficiency title='Weapon Proficiencies' ph='Shortswords, Light Crossbows' value={weaponProfs} path='weaponProfs' update={update} updateData={updateData} revertData={revertData} />
      <Proficiency title='Tool Proficiencies' ph='Artison Tools, Thieves tools' value={toolProfs} path='toolProfs' update={update} updateData={updateData} revertData={revertData} />
    </Container>
  )
}

export default Proficiencies;