import React, { Component } from 'react';
import styled from 'styled-components';

import T from './Text';

import EditExperience from '../modals/SideInfo/Experience';

import { getLevel } from '../data/levels';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 5px;
`

const BarContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 1.7em;

  background-color: ${props => props.theme.middleblack};
  border-left: 2px;
  border-right: 2px;
  border-style: solid;
  border-color: ${props => props.theme.almostblack};

  @media only screen and (min-width: 768px) {
    height: 10px;
    border: 1px solid;
  }
`

const BarFiller = styled.div`
  display: flex;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;

  width: ${props => `${props.value}%`};

  background-color: ${props => props.theme[props.color] || props.theme.text};
`

const Text = styled(T)`
  z-index: 50;
  color: rgb(255, 255, 255, .8);
`

const DesktopText = styled(Text)`
  display: none;
  font-size: 0.9em;

  @media only screen and (min-width: 768px) {
    display: block;
  }
`

const MobileText = styled(Text)`
  @media only screen and (min-width: 768px) {
    display: none;
  }
`

const determinPercent = (current, max, temp = 0, isTemp = true) => (current > max) ? 100 : ((current + ((isTemp) ? temp : 0)) / (max + temp)) * 100;

class EXP extends Component {
  constructor(props) {
    super(props);

    this.editEXP = this.editEXP.bind(this);
  }

  editEXP() {
    const { openModal, closeModal } = this.props;

    openModal({
      id: 'expeditmodal',
      type: 'custom',
      content: <EditExperience {...this.props} requestClose={() => closeModal({ id: 'expeditmodal' })} />
    })
  }

  render() {
    const { current } = this.props;

    const max = getLevel(current).exp

    const expRender = determinPercent(current, max);

    return (
      <Container>
        <DesktopText>EXP: {current}/{max}</DesktopText>
        <BarContainer onClick={this.editEXP}>
          <MobileText>EXP: {current}/{max}</MobileText>
          <BarFiller value={expRender} color='gold' />
        </BarContainer>
      </Container>
    )
  }
}

export default EXP;