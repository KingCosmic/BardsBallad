import React from 'react';
import styled from 'styled-components';

import Text from './Text';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  color: ${props => props.theme.gold};
  margin-bottom: 5px;
  font-size: 2em;
  border-bottom: 1px solid ${props => props.theme.gold};
`

const SkillContainer = ({
  title, stat, children
}) => {
  return (
    <Container>
      <HeaderContainer>
        <Text color='gold'>{title}</Text>
      </HeaderContainer>

      {
        children
      }
    </Container>
  )
}

export default SkillContainer;