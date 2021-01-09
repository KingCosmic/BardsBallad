import React from 'react'
import styled from 'styled-components'

import { Character } from '../../../types'

import Level from './Level'

import Property from './Property'

import { getLevel } from '../../../system'

const Avatar = styled.div<{ src: string }>`
  position: relative;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  background: url(${props => props.src});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-right: 15px;
`

const TopContainer = styled.div`
  display: flex;
  padding-bottom: 20px;
  width: 100%;
  align-items: center;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
  align-items: center;
  overflow-y: auto;
  height: 100%;
  width: 50%;
`

const Title = styled.p`
  font-size: 1em;
`

const SubValue = styled.p`
  color: rgba(255, 255, 255, .6);
  font-size: .9em;
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

type Props = {
  char: Character
}

function InfoTab({ char }: Props) {
  const { name, avatar, exp, job, race, background, alignment, backstory } = char;

  return (
    <Container>
      <TopContainer>
        <Avatar src={avatar}><Level>{getLevel(exp).level}</Level></Avatar>
        <BottomContainer>
          <Title>{name}</Title>
          <SubValue>{job}</SubValue>
        </BottomContainer>
      </TopContainer>

      <BottomContainer>
        <Row>
          <Property title='Background' value={background} />
          <Property title='Race' value={race} />
        </Row>
        <Row>
          <Property title='Alignment' value={alignment} />
          <Property title='Age' value='26' />
        </Row>
        <Property title='Backstory' value={backstory} />
      </BottomContainer>
    </Container>
  )
}

export default InfoTab