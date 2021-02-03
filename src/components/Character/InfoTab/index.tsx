import React, { useState } from 'react'
import styled from 'styled-components'

import EditingInfo from './Editing'
import Property from './Property'
import Level from './Level'

import { Character } from '../../../types'
import { getLevel } from '../../../system'
import { updateInfo } from '../../../services/db'

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
  width: 100%;
  align-items: flex-end;
  margin-bottom: 20px;
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

const EditButton = styled.p`
  color: ${props => props.theme.text};
  background-color: ${props => props.theme.green};
  position: fixed;
  right: calc(50% + 60px);
  bottom: 20px;
  font-size: 2em;
  padding: 7px 19px;
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`

type Props = {
  char: Character
}

function InfoTab({ char }: Props) {
  const { name, avatar, exp, job, race, background, alignment, backstory, age } = char;

  const [editing, setIsEditing] = useState(false)

  return (
    <Container>
      {
        editing ?

          <EditingInfo data={char} saveData={info => {
            updateInfo(info)
            setIsEditing(false)
          }} />
          
          : (
          <>
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
                <Property title='Age' value={age} />
              </Row>
              <Property title='Backstory' value={backstory} />
            </BottomContainer>

            <EditButton onClick={() => setIsEditing(true)}>&#43;</EditButton>
          </>
        )
      }
    </Container>
  )
}

export default InfoTab