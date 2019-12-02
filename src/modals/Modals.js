import React, { Component } from 'react';
import styled from 'styled-components';

import Modal from './Modal';

import { connect } from 'react-redux';

const Container = styled.div`
  display: ${props => props.modals.length !== 0 ? 'block' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 100;
`

class Modals extends Component {
  render() {
    const { modals } = this.props;

    return (
      <Container modals={modals}>
        {
          modals.map((item, i) => {
            return <Modal item={item} key={i} zIndex={i} />
          })
        }
      </Container>
    );
  }
}

const mapStateToProps = (state) =>
  ({ modals: state.modals.modals })

export default connect(mapStateToProps, {  })(Modals);