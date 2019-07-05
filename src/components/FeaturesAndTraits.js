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

  }

  render() {
    const { char: { feats }, showAddFeat, update  } = this.props;

    const featdata = mergeUpdates(feats, update.feats || []);

    return (
      <Container height='calc(100% - 40px)' width='calc(100% - 40px)' padding='20px' direction='row'>
        <Container width='58.5%'>
          <Search ph='Search Features And Traits...' />

          <Container flowY='auto' height='calc(90% - 20px)' margin='10px 0'>
            <List>
              {
                featdata.map((feat, i) => {
                  return <Feat index={i}
                    key={feat.id} {...feat}
                  />
                })
              }
            </List>
          </Container>

          <AddItem onClick={showAddFeat}>Add Feat or Trait</AddItem>
        </Container>

      </Container>
    )
  }
}

export default Feats;