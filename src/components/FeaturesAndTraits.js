import React, { Component } from 'react';
import styled from 'styled-components';
import { mergeUpdates } from '../helpers';

import I from '../atoms/Input';

import Container from '../atoms/Container';
import Button from '../atoms/Button';
import List from '../atoms/List';
import Feat from './Feat';
import ListItem from '../atoms/ListItem';

import Search from './Search';

import { connect } from 'react-redux';
import { addFeat, updateFeat } from '../reducers/characters';
import { editItem } from '../reducers/ui';

const Input = styled(I)`
  outline: none;
  border: none;
  background-color: ${props => props.theme.dark};
  color: ${props => props.theme.text};
  padding: 5px;
  margin: 1px;

  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`

const DescriptionEdit = styled.textarea`
  background-color: ${props => props.theme.dark};
  color: ${props => props.theme.text};
  resize: none;
  margin: 1px;
  outline: none;
  border: none;
  height: 50px;
  padding: 5px;
`

const Save = styled(Container)`
  color: ${props => props.theme.text};
  background-color: ${props => props.theme.green};
  margin: 1px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`

const AddItem = styled(Button)`
  text-align: center;
`

class Feats extends Component {
  constructor(props) {
    super(props);

    this.handleSave = this.handleSave.bind(this);
    this.renderItemOrEditField = this.renderItemOrEditField.bind(this);
  }

  handleSave() {
    const { editing } = this.props;
    const { name, uses, description } = this.refs;


    this.props.updateFeat(editing, {
      name: name.value,
      uses: uses.value,
      description: description.value
    })
  }

  renderItemOrEditField(item, i) {
    const { name, uses, description, id } = item;
    const { editItem, editing } = this.props;

    if (editing === id) {
      return (
        <ListItem key={id} padding='10px 0' direction='column'>
          <Container direction='row' >
            <Input ref='name' type='text' height='1.5em' width='40%' defaultValue={name} />
            <Input ref='uses' type='number' height='1.5em' width='10%' defaultValue={uses} align='center' />
            <Save width='20%' onClick={this.handleSave}>Save</Save>
          </Container>
          <DescriptionEdit ref='description' defaultValue={description} />
        </ListItem>
      )
    }

    return <Feat index={i}
      key={id} name={name} uses={uses} description={description}
      onClick={() => editItem(id)}
    />
  }

  render() {
    const { feats, addFeat, data } = this.props;

    const featdata = mergeUpdates(feats, data.feats || []);

    return (
      <Container height='calc(100% - 40px)' width='calc(100% - 40px)' padding='20px' direction='row'>
        <Container width='58.5%'>
          <Search />

          <Container flowY='auto' height='calc(90% - 20px)' margin='10px 0'>
            <List>
              {
                featdata.map((feat, i) => {
                  return this.renderItemOrEditField(feat, i)
                })
              }
            </List>
          </Container>

          <AddItem onClick={addFeat}>Add Feat or Trait</AddItem>
        </Container>

      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    feats: state.characters.character.feats,
    data: state.characters.update.data,
    empty: state.characters.update.empty,
    editing: state.ui.editing
  }
}

export default connect(mapStateToProps, { addFeat, updateFeat, editItem })(Feats);