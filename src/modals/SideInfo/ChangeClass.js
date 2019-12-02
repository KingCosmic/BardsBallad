import React, { Component } from 'react';
import styled from 'styled-components';

import T from '../../components/Text';

const BackDrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, .6);

  display: flex;
  justify-content: center;
  align-items: center;
`

const Container = styled.div`
  width: 90%;
  max-height: 60%;
  background-color: ${props => props.theme.light};
  border-radius: 10px;
  padding: 20px;

  display: flex;
  flex-direction: column;
  align-items: center;

  @media only screen and (min-width: 768px) {
    width: 38%;
  }
`

const Title = styled(T)`
  color: ${props => props.theme.gold};
  font-size: 1.7em;
  padding-bottom: 15px;
`

const Row = styled.div`
  display: flex;
  padding: 20px 0;
  width: 100%;
  justify-content: space-around;
  align-items: center;
`

const Button = styled(T)`
  background-color: ${props => props.cancel ? props.theme.red : props.theme.green};
  border-radius: 5px;
  padding: 10px;
  font-size: 1.3em;
  text-align: center;
  width: 40%;
`

const Input = styled.input`
  margin: 0 15px;
  color: rgba(20, 20, 20, .85);
  border: none;
  background: ${props => props.theme.dark};
  border: 2px solid ${props => props.theme.middleblack};
  padding: 10px;
  border-radius: 4px;
  appearance: none;
  color: ${props => props.theme.gold};
  font-size: 1.4em;
  width: 80%;
  text-align: center;

  &:focus {
    outline: none;
  }
`

class ChangeClass extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.job
    }

    this.handleClass = this.handleClass.bind(this);
    this.confirmChange = this.confirmChange.bind(this);
  }

  handleClass(event) {
    this.setState({ value: event.target.value });
  }

  confirmChange() {
    const { requestClose, syncData, characterID } = this.props;

    const { value } = this.state;

    requestClose()
    syncData(
      characterID,
      {
        job: value
      }
    )
  }

  render() {
    const { requestClose } = this.props;
    const { value } = this.state;

    return (
      <BackDrop onClick={requestClose}>
        <Container onClick={(e) => e.stopPropagation()}>

          <Title>Edit Class</Title>

          <Input defaultValue={value} onChange={this.handleClass} />

          <Row>
            <Button onClick={requestClose} cancel>Cancel</Button>
            <Button onClick={this.confirmChange}>Confirm</Button>
          </Row>

        </Container>
      </BackDrop>
    )
  }
}

export default ChangeClass;