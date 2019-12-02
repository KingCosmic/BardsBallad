import React, { Component } from 'react';
import styled from 'styled-components';

import T from './Text';

import EditHealth from '../modals/SideInfo/Health';

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
  color: ${props => props.theme.text};
`

const DesktopText = styled(Text)`
  display: none;
  font-size: 0.9em;

  @media only screen and (min-width: 768px) {
    display: block;
  }
`

const MobileText = styled(Text)`
  opacity: .8;
  @media only screen and (min-width: 768px) {
    display: none;
  }
`

const determinPercent = (current, max, temp = 0, isTemp = true) => ((current + ((isTemp) ? temp : 0)) / (max + temp)) * 100;

class HP extends Component {
  constructor(props) {
    super(props);

    this.editHP = this.editHP.bind(this);
  }

  editHP() {
    const { openModal, closeModal } = this.props;

    openModal({
      id: 'hpeditmodal',
      type: 'custom',
      content: <EditHealth {...this.props} requestClose={() => closeModal({ id: 'hpeditmodal' })} />
    })
  }

  render() {
    const { current, max, temp } = this.props;

    const tempRender = determinPercent(current, max, temp);
    const hpRender = determinPercent(current, max, temp, false);

    return (
      <Container>
        <DesktopText>HP: {current}/{max} {(temp) ? ` (+${temp})` : ''}</DesktopText>
        <BarContainer onClick={this.editHP}>
          <MobileText>HP: {current}/{max} {(temp) ? ` (+${temp})` : ''}</MobileText>
          <BarFiller value={tempRender} color='blue' />
          <BarFiller value={hpRender} color='green' />
        </BarContainer>
      </Container>
    )
  }
}

export default HP;