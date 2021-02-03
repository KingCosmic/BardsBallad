import React from 'react'
import styled from 'styled-components'

const Title = styled.p`
  font-size: 1em;
`

const SubValue = styled.p`
  color: rgba(255, 255, 255, .6);
  font-size: .9em;
`

const PropertyContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

type Props = {
  title: string,
  value: string | number
}

function Property({ title, value }: Props) {
  return (
    <PropertyContainer>
      <Title>{title}</Title>
      <SubValue>{value}</SubValue>
    </PropertyContainer>
  )
}

export default Property;