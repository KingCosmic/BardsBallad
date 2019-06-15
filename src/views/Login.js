import React, { Component } from 'react';
import styled from 'styled-components';

import { Link as L } from 'react-router-dom';

import Container from '../atoms/Container';
import Button from '../atoms/Button';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

import api from '../api';

const Link = styled(L)`
  color: rgba(255, 255, 255, .6);
`

const Input = styled.input`
  margin-bottom: ${props => props.first ? '10px' : '20px'};
  padding: 4px;
  border: none;
  appearance: none;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border-radius: 4px;
  font-size: 1vw;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.light};
  width: 20%;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    }

    this.handleEmail = this.handleEmail.bind(this);
    this.handlePass = this.handlePass.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  // redirect if we're already logged in
  componentWillMount() {
    if (api.loggedIn())
      this.props.history.replace('/characters');
  }

  handleEmail(event) {
    this.setState({ email: event.target.value });
  }

  handlePass(event) {
    this.setState({ password: event.target.value });
  }

  handleLogin(event) {
    const { email, password } = this.state;

    api.login(
      email,
      password
    ).then(resp => {
      this.props.history.replace('/characters')
    }).catch(alert)

    event.preventDefault();
  }

  render() {
    return (
      <Container justifyContent='center' alignItems='center' height='100%' bg='almostblack'>
        <Form onSubmit={this.handleLogin}>
          <Title align='center' margin='0 0 10px 0'>Login</Title>
          <Input first
            placeholder='KingCosmicDev@gmail.com' type='text'
            value={this.state.email} onChange={this.handleEmail}
          />

          <Input
            placeholder='password' type='password'
            value={this.state.password} onChange={this.handlePass}
          />
          <Button onClick={this.handleLogin}>Login</Button>
        </Form>
        <Text>Need to <Link to={`/signup`}>signup?</Link></Text>
      </Container>
    )
  }
}

export default Login;