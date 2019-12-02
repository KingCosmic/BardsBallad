import React, { Component } from 'react';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { toggleSideNav } from '../reducers/ui';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;

  position: fixed;
  z-index: 50;
  top: 0;
  left: 0;
  width: 20%;
  height: 100%;
  overflow-x: hidden;
  perspective: 4000px;

  @media only screen and (min-width: 768px) {
    position: static;
    z-index: 0;
    width: 11%;
    background-color: ${props => props.theme.dark};
    border-right: 1px solid ${props => props.theme.almostblack};
  }
`

const MenuItem = styled.p`
  background-color: ${props => props.theme.dark};
  border: 2px solid ${props => props.theme.almostblack};
  font-size: 4em;
  width: 100%;
  text-align: center;
  color: ${props => props.theme.text};
  pointer-events: all;

  transition: transform 0.3s linear;
  transform-origin: left;

  &:nth-child(2) {
    transition-delay: 0.1s;
  }

  &.fold {
    transform: rotate3d(0, 1, 0, 100deg);
    pointer-events: none;
  }
`

class SlideOut extends Component {
  render() {
    const { open, toggleSideNav } = this.props;

    return (
      <Container isOpen={open}>
        <MenuItem onClick={toggleSideNav} className={open ? '' : 'fold'}>&times;</MenuItem>
        <MenuItem className={open ? '' : 'fold'}>BB</MenuItem>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    open: state.ui.isSideNavOpen
  }
}

export default connect(mapStateToProps, { toggleSideNav })(SlideOut);