import React, { Component } from 'react';
import styled from 'styled-components';

import Container from '../atoms/Container';
import Title from '../atoms/Title';
import Form from '../atoms/Form';
import Input from '../atoms/Input';

const Overlay = styled(Container)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.3);

  justify-content: center;
  align-items: center;

  z-index: 100;
`
class EditOverlay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ''
    }
  }

  render() {
    const { property, data } = this.props;

    return (
      <Overlay>
        <Container width='450px' height='350px' bg>
          <Title>Edit</Title>
          <Form>
            <Input />
          </Form>
        </Container>
      </Overlay>
    )
  }
}

export default EditOverlay;