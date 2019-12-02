import React, { Component } from 'react';
import styled from 'styled-components';

import { Link as L } from 'react-router-dom';

import Button from '../components/Button';
import Text from '../components/Text';

import api from '../api';

const BackDrop = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: ${props => props.theme.middleblack};
`

const Header = styled(Text)`
  color: ${props => props.theme.gold};
  text-align: center;
  font-size: 2em;
  margin-bottom: 20px;
`

const Link = styled(L)`
  color: rgba(255, 255, 255, .6);
`

const Input = styled.input`
  margin-bottom: ${props => props.first ? '15px' : '20px'};
  padding: 10px;
  color: rgba(20, 20, 20, .85);
  border: none;
  appearance: none;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border-radius: 4px;
  font-size: 1em;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 80%;
  padding: 10px;
  margin-bottom: 10px;
`

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    }

    this.handleEmail = this.handleEmail.bind(this);
    this.handlePass = this.handlePass.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
  }

  // redirect if we're already logged in
  UNSAFE_componentWillMount() {
    if (api.loggedIn())
      this.props.history.replace('/characters');
  }

  handleEmail(event) {
    this.setState({ email: event.target.value });
  }

  handlePass(event) {
    this.setState({ password: event.target.value });
  }

  handleSignup(event) {
    const { email, password } = this.state;

    api.signup(
      email,
      password
    ).then(resp => {
      this.props.history.replace('/characters')
    }).catch(alert)

    event.preventDefault();
  }

  render() {
    return (
      <BackDrop>
        <Form onSubmit={this.handleSignup}>
          <Header>Signup</Header>
          <Input first
            placeholder='KingCosmicDev@gmail.com' type='text'
            value={this.state.email} onChange={this.handleEmail}
          />

          <Input
            placeholder='password' type='password'
            value={this.state.password} onChange={this.handlePass}
          />
          <Button onClick={this.handleSignup}>Signup</Button>
        </Form>
        <Text>Need to <Link to={`/login`}>login?</Link></Text>
      </BackDrop>
    )
  }
}

export default Signup;