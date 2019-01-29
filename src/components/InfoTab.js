import React from 'react';

import List from '../atoms/List';
import ListItem from '../atoms/ListItem';
import Container from '../atoms/Container';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

const InfoTab = (props) => {
  return (
    <Container flowY='scroll' width='calc(100% - 20px)' height='calc(100% - 20px)' padding='10px'>
      <List>
        <ListItem height='auto'>
          <Container height='450px' width='300px' alignItems='center'>
            <Title>Appearance</Title>

            <Container noFlex width='100%' height='100%'>
              <img style={{ display: 'block', height: '100%', margin: '0 auto' }} src='https://cdn.discordapp.com/attachments/493961153995735060/536486332663332874/GoblinSlayer.png' alt='appearance' />
            </Container>
          </Container>

          <Container grow='1' margin='0 0 0 10px'>
            <Container grow='1' padding='10px'>
              <Title margin='0 0 10px 0' >Personality Traits</Title>

              <Text size='0.8em'>
                I don't run from evil; Evil runs from me.
              </Text>
            </Container>

            <Container grow='1' margin='10px 0 0 0' padding='10px'>
              <Title margin='0 0 10px 0' >Ideals</Title>

              <Text size='0.8em'>
                Our lot is to lay down our lives in defense of others.
              </Text>
            </Container>

            <Container grow='1' margin='10px 0 0 0' padding='10px'>
              <Title margin='0 0 10px 0' >Bonds</Title>

              <Text size='0.8em'>
                Someone saved my life on the battlefield. To this day, I will never leave a friend behind.
              </Text>
            </Container>

            <Container grow='1' margin='10px 0 0 0' padding='10px'>
              <Title margin='0 0 10px 0' >Flaws</Title>

              <Text size='0.8em'>
                Years of seeing innocent people suffer have left me despondent and pessimistic for the future.
              </Text>
            </Container>
          </Container>
        </ListItem>

        <ListItem margin='10px 0 0 0' padding='10px' justifyContent='space-around'>
          <Container>
            <Title>Alignment</Title>

            <Text>Lawful/Neutral</Text>
          </Container>

          <Container>
            <Title>Race</Title>

            <Text>Human Variant</Text>
          </Container>

          <Container>
            <Title>background</Title>

            <Text>Solider</Text>
          </Container>

          <Container>
            <Title>Languages</Title>

            <Text>Common, Celestial</Text>
          </Container>
        </ListItem>

        <ListItem maxHeight='150px' direction='column' margin='10px 0 0 0' padding='10px'>
          <Title margin='0 0 10px 0'>Backstory</Title>

          <Text size='0.8em'>Goblin Slayer was once an ordinary boy in a village, who wanted to be an adventurer when he grew up. One day, his best friend left to work on a farm for a few days, and the two fought because he couldn't go with her. Later that night, his village was attacked by goblins and everyone he knew was killed.</Text>
        </ListItem>

        <ListItem maxHeight='400px' margin='10px 0 0 0' padding='10px'>

          <Container width='100%' margin='0 10px 0 0'>
            <Title margin='0 0 10px 0'>Allies</Title>

            <Text size='0.8em'>
              Ace the Human (Captain), Mako the Half-Elf (Deceased, former First Mate), Jan Hagel the Tiefling (deckhand), Muldan the Dwarf (First Mate), Trost the Dwarf (Shipwright), Keleseth The Elf, Hooktusk the Troll, Patches the Human, (Boarding Party)
            </Text>
          </Container>

          <Container noFlex>
            <Container width='200px' height='200px'>
              <Title align='center'>Organization</Title>
              <Container>
                <img style={{ width: '100%'}} src='https://cdn.discordapp.com/emojis/536669809715445770.png?v=1' alt='thing' />
              </Container>
              <Text align='center'>Sleeping Knights</Text>
            </Container>
          </Container>
        </ListItem>
      </List>
    </Container>
  )
}

export default InfoTab;