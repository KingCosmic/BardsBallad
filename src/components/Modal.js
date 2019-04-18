import React from 'react';
import styled from 'styled-components';

import C from '../atoms/Container';

import AddItem from './AddItem';

import { connect } from 'react-redux';
import { hideModal } from '../reducers/ui';

const Container = styled(C)`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 10000;
  background-color: rgba(0, 0, 0, .85);
  justify-content: center;
  align-items: center;

  display: ${props => props.visible ? 'flex' : 'none'};
`

const Modal = ({ overlay, hideModal }) => {
  return (
    <Container visible={overlay !== ''} onClick={hideModal}>
      {
        (overlay === 'AddItem') ? <AddItem /> : ''
      }
    </Container>
  )
}

const mapStateToProps = (state) => {
  return {
    overlay: state.ui.overlay
  }
}

export default connect(mapStateToProps, { hideModal })(Modal);