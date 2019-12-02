import React from 'react';
import styled from 'styled-components';

import Text from '../components/Text';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  padding-top: 70px;
  align-items: center;
  overflow-y: auto;
  height: 100%;
  width: 100%;

  @media only screen and (min-width: 768px) {
    padding: 15px;
  }
`

const TopContainer = styled.div`
  display: flex;
  padding: 20px 0;
  width: 100%;
  align-items: center;
`

const BottomContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const Row = styled.div`
  display: flex;
  padding: 10px 0;
  padding-top: 0px;
`

const Apperance = styled.div`
  position: relative;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  background: url('https://cdn.discordapp.com/attachments/253626179557392395/643354507278942218/checkpfp.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-right: 15px;
`

const Level = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${props => props.theme.blue};
  position: absolute;
  bottom: -5px;
  right: 5px;
  width: 25px;
  height: 25px;
  text-align: center;
  border-radius: 50%;
  color: ${props => props.theme.text};
  font-family: OpenSans;
  font-weight: 200;
  font-size: 0.9em;
`

const PropertyContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const Title = styled(Text)`
  font-size: 1em;
`

const SubValue = styled(Text)`
  color: rgba(255, 255, 255, .6);
  font-size: .9em;
`

function Property({ title, value }) {
  return (
    <PropertyContainer>
      <Title>{title}</Title>
      <SubValue>{value}</SubValue>
    </PropertyContainer>
  )
}

const InfoTab = () => {
  return (
    <Container>
      <TopContainer>
        <Apperance><Level>6</Level></Apperance>
        <BottomContainer>
          <Title>Aliza Cartwight</Title>
          <SubValue>Wild Magic Sorcerer</SubValue>
        </BottomContainer>
      </TopContainer>
      <BottomContainer>

        <Row>
          <Property title='Background' value='Farmhand' />
          <Property title='Race' value='Half-Elf' />
        </Row>
        <Row>
          <Property title='Alignment' value='Neutral/Good' />
          <Property title='Age' value='26' />
        </Row>
        <Property title='Backstory' value="Aliza Cartwright is a female farmhand who, when clergymen of the church found and killed her father for adultery, was forced to return to her mother' s hovel in Estermeyer, where she grew up. Aliza, discontent with her new life and seeking medicine for her now-ailing mother returned to the scene of the murder to find some old family artifacts, but instead found the house nearly immaculate with a small entity sitting inside. Mittsie, as the creature identified itself, is a shadow spirit 'in training', sent by her master Alevie to find and torment the people responsible for the murders" />
      </BottomContainer>
    </Container>
  )
}

export default InfoTab;