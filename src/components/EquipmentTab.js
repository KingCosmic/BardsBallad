import React, { Component } from 'react';
import styled from 'styled-components';

import Container from '../atoms/Container';
import Filter from '../atoms/Filter';
import List from '../atoms/List';
import Item from './Item';
import Title from '../atoms/Title';
import Text from '../atoms/Text';
import Input from '../atoms/Input';
import Button from '../atoms/Button';

// wasnt sure about the box shadow or not
// box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, .1);
const SearchContainer = styled(Container)`

`

const Search = styled.input`
  flex-grow: 1;
  background: rgba(114, 118, 125, .3);
  border: 1px solid black;
  border-radius: 5px 0 0 5px;

  height: 44px;
  font-size: 16px;
  font-weight: 200;
  font-family: OpenSans;

  color: white;
  border: none;
  outline: none;

  padding: 0 12px;
  box-shadow: none;
`

const DropDownContent = styled(Container)`
  display: none;
  position: absolute;
  background-color: black;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, .2);
  padding: 12px 16px;
  z-index: 1;
`

const SearchIcons = styled(Container)`
  background: rgba(114, 118, 125, .3);
  border-radius: 0 5px 5px 0;

  height: 44px;
  font-size: 16px;
  font-weight: 300;
  line-height: 44px;
`

const DropDown = styled(Container)`
  min-width: 39px;
  border-left: 1px solid ${props => props.theme.grey};
  justify-content: center;

  position: relative;
  display: inline-block;
  padding: 0 10px;

  &:hover ${DropDownContent} {
    display: flex;
  }
`

const AddItem = styled(Button)`
  text-align: center;
`

const items = [
  {
    type: 'Heavy Armor',
    name: 'chainmail',
    description: 'Made of interlocking metal rings, chain mail includes a layer of quilted fabric worn underneath the mail to prevent chafing and to cushion the impact of blows. The suit includes gauntlets.',
    equipped: true,
    effects: [
      { type: 'buff', what: 'AC', amount: 16 }
    ]
  },
  {
    type: 'Martial Weapon',
    name: 'Maul',
    description: 'Made of interlocking metal rings, chain mail includes a layer of quilted fabric worn underneath the mail to prevent chafing and to cushion the impact of blows. The suit includes gauntlets.',
    equipped: true,
    effects: [
      { type: 'buff', what: 'AC', amount: 16 }
    ]
  },
]

const modifiers = [
  { title: 'chainmail', target: 'ac', amount: 16 }
]

class EquipmentTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: 'all'
    }

    this.changeFilter = this.changeFilter.bind(this);
  }

  changeFilter(filter) {
    this.setState({ filter })
  }

  render() {
    const { char, showAddItem } = this.props;
    const { filter } = this.state;

    return (
      <Container height='calc(100% - 40px)' width='calc(100% - 40px)' padding='20px' direction='row'>

        <Container width='70%'>
          <SearchContainer direction='row'>
            <Search placeholder='Search...' spellcheck='false' />
            <SearchIcons direction='row'>
              <DropDown>
                <Text align='center'>All</Text>
                <DropDownContent>
                  <Text>Testing</Text>
                </DropDownContent>
              </DropDown>
            </SearchIcons>
          </SearchContainer>

          <Container flowY='auto' height='calc(90% - 20px)' margin='10px 0'>
            <List>
              {
                items.map((item, i) => {
                  return (
                    <Item item={item} />
                  )
                })
              }
            </List>
          </Container>
          <AddItem onClick={showAddItem}>Add Item</AddItem>
        </Container>

      </Container>
    )
  }
}

export default EquipmentTab;