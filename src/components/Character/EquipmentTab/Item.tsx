import React from 'react'
import styled, { css } from 'styled-components'

// import { itemTypes } from '../data/constants';

const Text = styled.p`
  font-size: 1.2em;

  @media only screen and (min-width: 768px) {
    font-size: 1em;
  }
`

type ContainerProps = {
  index: number
}

const Container = styled.div<ContainerProps>`
  display: flex;
  width: 100%;
  padding: 5px;
  align-items: center;

  flex-direction: row;

  ${props =>
    Math.abs(props.index % 2) === 1 &&
    css`
      background-color: rgba(0, 0, 0, 0.17);
    `}
`

const EquippedCheckbox = styled.div`
  width: 1.2em;
  height: 1.2em;
  border: 1px solid ${props => props.theme.gold};
  border-radius: 50%;
  margin-right: 10px;

  @media only screen and (min-width: 768px) {
    width: 0.9em;
    height: 0.9em;
  }
`

const InnerContainer = styled.div`
  display: flex;
  flex: 1;

  justify-content: space-between;
  align-items: center;

  flex-direction: row;
`

type Props = {
  index: number
  data: any
  onClick(): void
}

const Item = ({ index, data, onClick }: Props) => {
  const { id, name, quantity } = data

  return (
    <Container onClick={onClick} key={id} index={index}>
      <EquippedCheckbox />
      <InnerContainer>
        <Text>{name}</Text>
        <Text>{quantity > 1 ? quantity : ''}</Text>
      </InnerContainer>
    </Container>
  )
}

export default Item
