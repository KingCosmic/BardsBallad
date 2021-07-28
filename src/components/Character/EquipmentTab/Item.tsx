import React from 'react'
import styled, { css } from 'styled-components'

// import { itemTypes } from '../data/constants';

type ContainerProps = {
  index: number
}

const Container = styled.div<ContainerProps>`
  display: flex;
  width: 100%;
  height: 32px;
  align-items: center;

  ${props =>
    Math.abs(props.index % 2) === 1 &&
    css`
      background-color: rgba(0, 0, 0, 0.17);
    `}
`

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 32px;
`

// to align the item with fixed measurements calculate the margins based on border width, checkbox width and height
// like the height of the item is 22 px and has 1px border but the height of the container is 32 so 22 + 2(border width on top and bottom) + 4(margin accounting for border width) = 32
//same for left margin
const Checkbox = styled.div`
  float: left;
  width: 20px;
  height: 20px;
  border: 1px solid ${props => props.theme.gold};
  border-radius: 50%;
`

const InnerContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`

const NameText = styled.p`
  font-size: 1em;
  width: calc(100% - 64px);
`

const QuantityText = styled.p`
  font-size: 1em;
  width: 64px;
  text-align: center;
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
      <CheckboxContainer>
        <Checkbox />
      </CheckboxContainer>
      <InnerContainer>
        <NameText>{name}</NameText>
        <QuantityText>{quantity}</QuantityText>
      </InnerContainer>
    </Container>
  )
}

export default Item
