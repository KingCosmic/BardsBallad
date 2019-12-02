import React, { Component } from 'react';
import styled from 'styled-components';

import StringEdit from './StringEdit';
import NumberEdit from './NumberEdit';

const Overlay = styled.div`
  display: flex;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .85);
  z-index: 60;

  justify-content: center;
  align-items: center;
`

const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
  outline: none;
  border-radius: 4px;
  width: 100%;
  height: 100%;

  @media only screen and (min-width: 768px) {
    height: 85%;
    width: 38%;
  }
`

class Modal extends Component {
  onClose() {
    if (this.props.item.onClose) this.props.item.onClose();

    this.props.onClose(this.props.item);
  }
  onConfirm() {
    if (this.props.item.onConfirm) {
      this.props.item.onConfirm();
      this.props.onClose(this.props.item);
    }
  }
  render() {
    const { item: { type } } = this.props;

    if (type === 'confirmation') {
      const { text } = this.props.item;
      return (
        <Overlay>
          <Content>
            <div className="text">{text}</div>
            <div className="buttons">
              <button className="modal-button" onClick={() => this.onConfirm()}>Confirm</button>
              <button className="modal-button" onClick={() => this.onClose()}>Close</button>
            </div>
          </Content>
        </Overlay>
      )
    } else if (type === 'string') {
      return (
        <Overlay>
          <Content>
            <StringEdit {...this.props.item} />
          </Content>
        </Overlay>
      )
    } else if (type === 'number') {
      return (
        <Overlay>
          <Content>
            <NumberEdit {...this.props.item} />
          </Content>
        </Overlay>
      )
    } else if (type === 'custom') {
      const { item: { content } } = this.props;

      return (
        <Overlay onMouseDown={content.props.requestClose}>
          <Content onMouseDown={(e) => e.stopPropagation()} custom>
            {content}
          </Content>
        </Overlay>
      )
    } else {
      return (
        <div></div>
      );
    }
  }
}

export default Modal;