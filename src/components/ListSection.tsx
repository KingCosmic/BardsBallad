import React, { ElementType } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 5px 5px;
  width: 100%;
`

type HeaderProps = {
  hcolor?: string
}

const Header = styled.div<HeaderProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 5px;
  border-bottom: 1px solid ${props => props.theme.gold};
  background-color: ${props =>
    props.hcolor ? props.theme[props.hcolor] : 'transparent'};
`

const HeaderText = styled.p`
  color: ${props => props.theme.gold};
  font-size: 1.4em;
`

type Props = {
  title: string
  Component?: ElementType<any>
  data?: any[]
  filter?(item: any): boolean
  headerColor?: string
  HeaderExtra?: ElementType<any>
  onClick?(item: any): void
  showOnEmpty?: boolean
}

const ListSection = ({
  title,
  Component,
  filter = () => true,
  data = [],
  headerColor,
  HeaderExtra = () => null,
  onClick = (item: any) => {},
  showOnEmpty = false,
}: Props) => {
  const filterdData = data.filter(filter)

  if (filterdData.length === 0 && showOnEmpty === false) return null

  return (
    <Container>
      <Header hcolor={headerColor}>
        <HeaderText>{title}</HeaderText>
        <HeaderExtra />
      </Header>
      <div>
        {filterdData.map((item: any, i) => {
          return (
            <Component
              item={item}
              index={i}
              key={item.id}
              onClick={() => onClick(item)}
            />
          )
        })}
      </div>
    </Container>
  )
}

export default ListSection
