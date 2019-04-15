import React from 'react';

import List from '../atoms/List';
import ListItem from '../atoms/ListItem';
import Container from '../atoms/Container';
import Title from '../atoms/Title';

import InlineEdit from '../atoms/InlineEdit';

const InfoTab = (props) => {

  const { 
    personality, alignment, race, background, languages,
    backstory, allies, organization
  } = props.char;

  const { traits, ideals, bonds, flaws } = personality;
  const { img, name } = organization;

  return (
    <Container flowY='scroll' width='calc(100% - 20px)' height='calc(100% - 20px)' padding='10px'>
      <List>
        <ListItem margin='0 0 20px 0'>
          <Container height='450px' width='300px' alignItems='center'>
            <Title header>Appearance</Title>

            <Container noFlex width='100%' height='calc(100% - 22px)'>
              <img style={{ display: 'block', height: '100%', margin: '0 auto' }} src='https://cdn.discordapp.com/attachments/391809595473002496/565996486874234890/adventurer.png' alt='appearance' />
            </Container>
          </Container>

          <Container grow='1'>
            <Container grow='1'>
              <Title margin='0 0 10px 0' header>Personality Traits</Title>

              <InlineEdit placeholder='here are some of my traits' path='personality.traits' value={traits} />
            </Container>

            <Container grow='1' margin='10px 0 0 0'>
              <Title margin='0 0 10px 0' header>Ideals</Title>

              <InlineEdit placeholder='Here are my ideals' path='personality.ideals' value={ideals} />
            </Container>

            <Container grow='1' margin='10px 0 0 0'>
              <Title margin='0 0 10px 0' header>Bonds</Title>

              <InlineEdit placeholder='These are my bonds' path='personality.bonds' value={bonds} />
            </Container>

            <Container grow='1' margin='10px 0 0 0'>
              <Title margin='0 0 10px 0' header>Flaws</Title>

              <InlineEdit placeholder='I have no flaws :angry:' path='personality.flaws' value={flaws} />
            </Container>
          </Container>
        </ListItem>

        <ListItem margin='10px 0 0 0' padding='10px' justifyContent='space-around'>
          <Container>
            <Title header>Alignment</Title>

            <InlineEdit placeholder='Chaotic/Stupid' path='alignment' value={alignment} />
          </Container>

          <Container>
            <Title header>Race</Title>

            <InlineEdit placeholder='Human' path='race' value={race} />
          </Container>

          <Container>
            <Title header>Background</Title>

            <InlineEdit placeholder='Soldier' path='background' value={background} />
          </Container>

          <Container>
            <Title header>Languages</Title>

            <InlineEdit placeholder='common' path='languages' value={languages} />
          </Container>
        </ListItem>

        <ListItem direction='column' margin='10px 0 0 0' padding='10px'>
          <Title margin='0 0 10px 0' header>Backstory</Title>

          <InlineEdit height='200px' placeholder='Heres my backstory :D' path='backstory' value={backstory} />
        </ListItem>

        <ListItem margin='10px 0 0 0' padding='10px'>

          <Container width='100%' margin='0 10px 0 0'>
            <Title margin='0 0 10px 0' header>Allies</Title>

            <InlineEdit placeholder='Its just me, myself, and I' path='allies' value={allies} />
          </Container>

          <Container noFlex>
            <Container width='200px' height='200px'>
              <Title align='center' header>Organization</Title>
              <Container>
                <img style={{ width: '100%'}} src={img} alt='thing' />
              </Container>
              <InlineEdit placeholder='Organization Name' path='organization.name' value={name} />
            </Container>
          </Container>
        </ListItem>
      </List>
    </Container>
  )
}

export default InfoTab;