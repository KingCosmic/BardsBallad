import React, { Component } from 'react';
import styled, { css } from 'styled-components';

import Container from '../atoms/Container';
import Text from '../atoms/Text';

const Header = styled(Container)`
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid ${props => props.theme.almostblack};
`

const Section = styled(Container)`
  border: 1px solid ${props => props.theme.almostblack};
  border-left: none;
`

const Input = styled.input`
  color: ${props => props.theme.text};

  resize: none;
  ${props => props.height && css` height: ${props => props.height}; `}
  margin: 0;
  margin-bottom: 10px;
  background: transparent;
  border: none;
  border-bottom: 1px solid ${props => props.theme.grey};
  outline-color: ${props => props.theme.gold};
`

const Description = styled.textarea`
  color: ${props => props.theme.text};
  resize: none;
  ${props => props.height && css` height: ${props => props.height}; `}
  margin: 0;
  margin-bottom: 10px;
  background: transparent;
  border: 1px solid ${props => props.theme.grey};
  outline-color: ${props => props.theme.gold};
`

class SpellEditing extends Component {
  render() {
    const { spell } = this.props;
    const { name } = spell;

    return (
      <Section height='calc(100% - 1px)' width='70%'>
        <Header>
          <Container padding='5px'><Text>Prepared: false</Text></Container>

          <Container padding='5px' onClick={() => {}}><Text>Save</Text></Container>
        </Header>
        <Container padding='10px'>

          <Container direction='row'>
            <Container width='calc(50% - 10px)' margin='0 20px 0 0'>
              <Text for='name' size='0.9em'>Spell Name</Text>
              <Input id='name'
                type='text' placeholder='Guidance'
                ref='name' defaultValue={name} 
              />
            </Container>

            <Container width='calc(50% - 10px)'>
              <Text for='school' size='0.9em'>Spell School</Text>
              <Input id='school'
                type='text' placeholder='Divination'
                ref='name' defaultValue={name} 
              />
            </Container>
          </Container>

          <Container direction='row' margin='0 0 20px 0'>
            <Container width='calc(50% - 10px)' margin='0 10px 0 0'>
              <Text for='time' size='0.9em'>Casting Time</Text>
              <Input id='time'
                type='text' placeholder='1 action'
                ref='name' defaultValue={name} 
              />
            </Container>

            <Container width='calc(50% - 10px)' margin='0 0 0 10px'>
              <Text for='range' size='0.9em'>Spell Range</Text>
              <Input id='range'
                type='text' placeholder='touch'
                ref='name' defaultValue={name} 
              />
            </Container>
          </Container>

          <Container direction='row' margin='0 0 20px 0'>
            <Container width='calc(50% - 10px)' margin='0 10px 0 0'>
              <Text for='time' size='0.9em'>Duration</Text>
              <Input id='time'
                type='text' placeholder='Concentration, up to 1 minute'
                ref='name' defaultValue={name} 
              />
            </Container>

            <Container width='calc(50% - 10px)' margin='0 0 0 10px'>
              <Text for='range' size='0.9em'>Spell Range</Text>
              <Input id='range'
                type='text' placeholder='touch'
                ref='name' defaultValue={name} 
              />
            </Container>
          </Container>

          <Text for='components' size='0.9em'>Components</Text>
          <Input id='components'
            type='text' placeholder='V, S'
            ref='name' defaultValue={name} 
          />

          <Text for='description' size='0.9em'>Description</Text>
          <Description id='description' height='100px'
            type='text' placeholder='You touch one willing creature. Once before the spell ends, the target can roll a d4 and add the number rolled to one ability check of its choice. It can roll the die before or after making the ability check. The spell then ends.'
            ref='name' defaultValue={name}
          />
        </Container>
      </Section>
    )
  }
}

export default SpellEditing;