import React, { Component } from 'react';
import styled from 'styled-components';

import { FaBars } from 'react-icons/fa'
import Text from './Text';

const Container = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  z-index: 1;
  background-color: ${props => props.theme.light};
  width: 100vw;
  height: 60px;
  position: fixed;
  top: 0;
  left: 0;
  border-bottom: 1px solid ${props => props.theme.middleblack};
  box-shadow: 0 1px 0 rgba(0,0,0,.2), 0 1.5px 0 rgba(0,0,0,.05), 0 2px 0 rgba(0,0,0,.05);

  @media only screen and (min-width: 768px) {
    display: none;
  }
`

const Title = styled(Text)`
  color: ${props => props.theme.gold};
  text-align: center;
  font-size: 1.6em;
  height: 60px;
  line-height: 60px;
`

const MenuIcon = styled(FaBars)`
  color: ${props => props.theme.text};
  font-size: 30px;
`

const NavButton = ({ onClick }) =>
  <MenuIcon onClick={onClick} />

class Header extends Component {
  render() {
    const {
      bgStyles,
      leftClick = () => {}, LeftComponent = NavButton,
      title = 'title',
      RightComponent = 'div', rightClick = () => {}
    } = this.props;

    return (
      <Container style={bgStyles}>
        <LeftComponent onClick={leftClick} />

        <Title>{title}</Title>

        <RightComponent onClick={rightClick} />
      </Container>
    )
  }
}

export default Header;