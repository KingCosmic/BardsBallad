import React, { Component } from 'react';
import styled from 'styled-components';

import Text from '../components/Text';

const Backdrop = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  background-color: rgba(0, 0, 0, .3);
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;

  padding: 0 20px;
  background-color: ${props => props.theme.light};
  border-radius: 5px;

  @media only screen and (min-width: 768px) {
    width: 35%;
  }
`

const Title = styled(Text)`
  color: ${props => props.theme.gold};
  font-size: 1.8em;
  padding-top: 10px;
`

const Row = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  margin: 10px 0;
`

const ProfText = styled(Text)`
  width: 2em;
`

const CheckBox = styled.div`
  background-color: ${props => props.checked ? props.theme[props.color] : props.theme.grey};
  width: 2em;
  height: 2em;
`

const Button = styled.div`
  background-color: ${props => props.theme[props.color]};
  color: ${props => props.theme.text};
  padding: 10px;
  font-size: 1.5em;
  border-radius: 4px;
`

class SelectProficiency extends Component {
  constructor(props) {
    super(props);

    const { efficient } = props;

    this.state = {
      value: efficient
    }

    this.changeValue = this.changeValue.bind(this);
    this.confirmChange = this.confirmChange.bind(this);
  }

  changeValue(value) {
    this.setState({
      value
    })
  }

  confirmChange() {
    const { characterID, syncData, requestClose, skill, efficient } = this.props;
    const { value } = this.state;

    if (value === efficient) return requestClose();

    requestClose()
    syncData(
      characterID,
      {
        [`skills.${skill}`]: value
      }
    )
  }

  render() {
    const { title, requestClose } = this.props;
    const { value } = this.state;

    return (
      <Backdrop onClick={requestClose}>
        <Container onClick={(e) => e.stopPropagation()}>
          <Title>{title.toUpperCase()}</Title>

          <Row>
            <ProfText>not</ProfText>
            <ProfText>half</ProfText>
            <ProfText>prof</ProfText>
            <ProfText>expert</ProfText>
          </Row>
          <Row>
            <CheckBox color='text' checked={value === 0} onClick={() => this.changeValue(0)} />
            <CheckBox color='blue' checked={value === 1} onClick={() => this.changeValue(1)} />
            <CheckBox color='green' checked={value === 2} onClick={() => this.changeValue(2)} />
            <CheckBox color='gold' checked={value === 3} onClick={() => this.changeValue(3)} />
          </Row>

          <Row>
            <Button color='red' onClick={requestClose}>cancel</Button>
            <Button color='green' onClick={this.confirmChange}>confirm</Button>
          </Row>
        </Container>
      </Backdrop>
    )
  }
}

export default SelectProficiency;