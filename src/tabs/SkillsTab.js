import React from 'react';
import styled from 'styled-components';

/*
import SkillContainer from '../components/SkillContainer';
import SavingThrow from '../components/SavingThrow';
import Skill from '../components/Skill';
*/

//import Proficiencies from '../components/Proficiencies';
import SavingThrows from '../components/SavingThrows';
import Skills from '../components/Skills';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 10px 15px;
  padding-top: 70px;
  overflow-y: auto;
  overflow-x: hidden;

  @media only screen and (min-width: 768px) {
    padding: 10px 15px;
  }
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const SkillsTab = ({ char, syncData, openModal, closeModal }) => {
  const { savingThrows, skills, stats, proficiency, _id } = char;

  const propInfo = { characterID: _id, prof: proficiency, stats, skills, throws: savingThrows, syncData, openModal, closeModal }

  return (
    <Container>
      <ContentContainer>
        <SavingThrows throws={savingThrows} {...propInfo} />
        <Skills skills={skills} {...propInfo} />
        
        {
          /*
          <SkillContainer title='Strength'>
            <SavingThrow skill='strength' {...propInfo} />
            <Skill skill='athletics' {...propInfo} />
          </SkillContainer>
          <SkillContainer title='Dexterity'>
            <SavingThrow skill='dexterity' {...propInfo} />
            <Skill skill='acrobatics' {...propInfo} />
            <Skill skill='sleightOfHand' {...propInfo} />
            <Skill skill='stealth' {...propInfo} />
          </SkillContainer>
          <SkillContainer title='Constitution'>
            <SavingThrow skill='constitution' {...propInfo} />
          </SkillContainer>
          <SkillContainer title='Intelligence'>
            <SavingThrow skill='intelligence' {...propInfo} />
            <Skill skill='arcana' {...propInfo} />
            <Skill skill='history' {...propInfo} />
            <Skill skill='investigation' {...propInfo} />
            <Skill skill='nature' {...propInfo} />
            <Skill skill='religion' {...propInfo} />
          </SkillContainer>
          <SkillContainer title='Wisdom'>
            <SavingThrow skill='wisdom' {...propInfo} />
            <Skill skill='animalHandling' {...propInfo} />
            <Skill skill='insight' {...propInfo} />
            <Skill skill='medicine' {...propInfo} />
            <Skill skill='perception' {...propInfo} />
            <Skill skill='survival' {...propInfo} />
          </SkillContainer>
          <SkillContainer title='Charisma'>
            <SavingThrow skill='charisma' {...propInfo} />
            <Skill skill='deception' {...propInfo} />
            <Skill skill='intimidation' {...propInfo} />
            <Skill skill='performance' {...propInfo} />
            <Skill skill='persuasion' {...propInfo} />
          </SkillContainer>
          */
        }
      </ContentContainer>
    </Container>
  )
}

export default SkillsTab;