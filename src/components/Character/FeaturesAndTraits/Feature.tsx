import React from 'react'
import styled, { css } from 'styled-components'

import Clamp from './Clamp'

import { renderReq } from '../../../system'
import { Feat } from '../../../types'

const Container = styled.div<{ index: number }>`
  display: flex;
  padding: 5px;
  cursor: pointer;
  flex-direction: column;

  ${props => (Math.abs(props.index % 2) === 1) && css`
    background-color: rgba(0, 0, 0, .17);
  `}
`

const Header = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
`

const Title = styled.p`
  color: ${props => props.theme.gold};
  font-size: 1.1em;
`

const Description = styled.p`
  font-size: 1em;
  margin-top: 5px;
  color: rgba(255, 255, 255, .6);
`

const Text = styled.p`
  font-size: 0.9em;
`

type Props = {
  data: Feat
  index: number
  onClick(): void
}

function Feature(props: Props) {
  const { data, index, onClick } = props

  const { name, uses, source, description } = data

  return (
    <Container index={index} onClick={onClick}>
      <Header>
        <Info>
          <Title>{name} {uses > 0 ? `(x${uses})` : ''}</Title>
          <Text>{'TODO: Show Reqs'}</Text>
        </Info>
        <Title>{source}</Title>
      </Header>

      <Clamp text={description} Component={Description} />
    </Container>
  )
}

export default Feature