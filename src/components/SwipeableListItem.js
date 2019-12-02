import React, { Component } from 'react';
import styled from 'styled-components';

import Text from './Text';

const Container = styled.div`
  position: relative;
  transition: max-height 0.5s ease;
  max-height: 1000px;
  transform-origin: top;
  overflow: hidden;
  width: 100%;
`

const OptionsContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding-right: 16px;
  color: white;
  background-color: #663bb7;
`

const ContentContainer = styled.div`
  width: 100%;
  align-items: center;
  background-color: #fff;
  height: 100%;
  display: flex;

  &.BouncingListItem {
    transition: transform 0.5s ease-out;
  }
`

class SwipeableListItem extends Component {
  constructor(props) {
    super(props);

    // Drag & Drop
    this.dragStartX = 0
    this.left = 0
    this.dragged = false

    this.container = React.createRef()
    this.optionsContainer = React.createRef()
    this.contentContainer = React.createRef()

    this.onMouseMove = this.onMouseMove.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onDragStartMouse = this.onDragStartMouse.bind(this)
    this.onDragStartTouch = this.onDragStartTouch.bind(this)
    this.onDragEndMouse = this.onDragEndMouse.bind(this)
    this.onDragEndTouch = this.onDragEndTouch.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
    this.updatePosition = this.updatePosition.bind(this)
    this.onSwiped = this.onSwiped.bind(this)
  }

  onDragStartMouse(evt) {
    this.onDragStart(evt.clientX);
    window.addEventListener("mousemove", this.onMouseMove);
  }

  onDragStartTouch(evt) {
    const touch = evt.targetTouches[0];
    this.onDragStart(touch.clientX);
    window.addEventListener("touchmove", this.onTouchMove);
  }

  onDragStart(clientX) {
    this.dragged = true;
    this.dragStartX = clientX;

    this.contentContainer.current.className = '';

    requestAnimationFrame(this.updatePosition);
  }

  onMouseMove(evt) {
    const left = evt.clientX - this.dragStartX;
    if (left < 0) {
      this.left = left;
    }
  }

  onTouchMove(evt) {
    const touch = evt.targetTouches[0];
    const left = touch.clientX - this.dragStartX;
    if (left < 0) {
      this.left = left;
    }
  }

  onDragEndMouse(evt) {
    window.removeEventListener("mousemove", this.onMouseMove);
    this.onDragEnd();
  }

  onDragEndTouch(evt) {
    window.removeEventListener("touchmove", this.onTouchMove);
    this.onDragEnd();
  }

  onDragEnd() {
    if (this.dragged) {
      this.dragged = false;

      const threshold = this.props.threshold || 0.3;

      if (this.left < this.contentContainer.current.offsetWidth * threshold * -1) {
        this.left = -this.contentContainer.current.offsetWidth * 2;

        this.container.current.style.maxHeight = 0;
        this.onSwiped();
      } else {
        this.left = 0;
      }
    }

    this.contentContainer.current.className = "BouncingListItem";
    this.contentContainer.current.style.transform = `translateX(${this.left}px)`;
  }

  onSwiped() {
    if (this.props.onSwipe) {
      this.props.onSwipe();
    }
  }

  componentDidMount() {
    window.addEventListener("mouseup", this.onDragEndMouse);
    window.addEventListener("touchend", this.onDragEndTouch);
  }

  componentWillUnmount() {
    window.removeEventListener("mouseup", this.onDragEndMouse);
    window.removeEventListener("touchend", this.onDragEndTouch);
  }

  updatePosition() {
    if (this.dragged) requestAnimationFrame(this.updatePosition);

    this.contentContainer.current.style.transform = `translateX(${this.left}px)`;

    // Fade the opacity
    const opacity = (Math.abs(this.left) / 100).toFixed(2);
    if (opacity < 1 && opacity.toString() !== this.optionsContainer.current.style.opacity) {
      this.optionsContainer.current.style.opacity = opacity.toString();
    }
    if (opacity >= 1) {
      this.optionsContainer.current.style.opacity = "1";
    }

    const now = Date.now();
    const elapsed = now - this.startTime;

    if (this.dragged && elapsed > this.fpsInterval) {
      this.contentContainer.current.style.transform = `translateX(${this.left}px)`;

      const opacity = (Math.abs(this.left) / 100).toFixed(2);
      if (opacity < 1 && opacity.toString() !== this.optionsContainer.current.style.opacity) {
        this.optionsContainer.current.style.opacity = opacity.toString();
      }
      if (opacity >= 1) {
        this.optionsContainer.current.style.opacity = "1";
      }

      this.startTime = Date.now();
    }
  }

  render() {
    return (
      <>
        <Container ref={this.container}>
          <OptionsContainer ref={this.optionsContainer}>
            <Text>Delete</Text>
          </OptionsContainer>

          <ContentContainer
            ref={this.contentContainer}
            onMouseDown={this.onDragStartMouse}
            onTouchStart={this.onDragStartTouch}
          >
            {this.props.children}
          </ContentContainer>
        </Container>
      </>
    )
  }
}

export default SwipeableListItem;