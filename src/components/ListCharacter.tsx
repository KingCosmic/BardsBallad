import React from 'react'
import styled from 'styled-components'

import { navigate } from 'gatsby'

import { Delete } from './Icons'

import { getLevel } from '../system'
import { deleteCharacter } from '../services/db'

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 5px;
  border-radius: 5px;
  background: url('https://cdn.discordapp.com/attachments/391809595473002496/579335189331836939/233.png');
  background-size: cover;
  background-repeat: no-repeat;

  cursor: pointer;
  display: inline-block;
  width: calc(33.33% - 30px);
  height: 120px;

  margin: 5px;

  background-position: 0% 0%;
`

const OptionsButton = styled.p`
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 2em;
`

const Name = styled.p`
  position: absolute;
  left: 10px;
  bottom: 10px;
`

type Props = {
  name: string
  job: string
  exp: number
  id: string
}

function ListCharacter(props: Props) {
  const { name, job, exp, id } = props

  return (
    <Container key={id} onClick={() => navigate(`/app/characters/${id}`)}>
      <OptionsButton onClick={(e) => {
        deleteCharacter(id)
        e.stopPropagation()
      }}>
        <Delete width='1em' height='1em' />
      </OptionsButton>

      <Name>
        {name} <br /> {job} ({getLevel(exp).level})
      </Name>
    </Container>
  )
}

export default ListCharacter
