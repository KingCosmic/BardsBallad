import React from 'react';
import styled from 'styled-components';

import Container from '../atoms/Container';
import Text from '../atoms/Text';
import List from '../atoms/List';

const Header = styled(Container)`
  flex-direction: row;
  justify-content: space-between;
  padding: 5px;
  border-bottom: 1px solid ${props => props.theme.gold};
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  background-color: ${props => props.hcolor ? props.theme[props.hcolor] : props.theme.light};
`

const ListSection = ({ title, Component, filter, data, headerColor, HeaderExtra = () => null, onClick = () => {} }) => {
  const filterdData = data.filter(filter);

  if (filterdData.length === 0) return null;

  return (
    <Container margin='0 5px 5px'>
      <Header hcolor={headerColor}>
        <Text color='gold'>{title}</Text>
        <HeaderExtra />
      </Header>
      <List>
        {
          filterdData.map((item, i) => {
            return (
              <Component item={item} {...item} index={i} key={item.id} onClick={onClick} />
            )
          })
        }
      </List>
    </Container>
  )
}

export default ListSection;