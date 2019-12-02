import React, { Component } from 'react';
import styled from 'styled-components';

import { Link as L } from 'react-router-dom';

import Button from '../components/Button';
import T from '../components/Text';

import api from '../api';

const Text = styled(T)`
  font-size: 1.3em;

  @media only screen and (min-width: 768px) {
    font-size: 1em;
  }
`

const BackDrop = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: linear-gradient(50deg, rgba(146, 146, 146, 0.02) 0%, rgba(146, 146, 146, 0.02) 25%,rgba(82, 82, 82, 0.02) 25%, rgba(82, 82, 82, 0.02) 50%,rgba(217, 217, 217, 0.02) 50%, rgba(217, 217, 217, 0.02) 75%,rgba(41, 41, 41, 0.02) 75%, rgba(41, 41, 41, 0.02) 100%),linear-gradient(252deg, rgba(126, 126, 126, 0.01) 0%, rgba(126, 126, 126, 0.01) 25%,rgba(117, 117, 117, 0.01) 25%, rgba(117, 117, 117, 0.01) 50%,rgba(219, 219, 219, 0.01) 50%, rgba(219, 219, 219, 0.01) 75%,rgba(41, 41, 41, 0.01) 75%, rgba(41, 41, 41, 0.01) 100%),linear-gradient(272deg, rgba(166, 166, 166, 0.01) 0%, rgba(166, 166, 166, 0.01) 20%,rgba(187, 187, 187, 0.01) 20%, rgba(187, 187, 187, 0.01) 40%,rgba(238, 238, 238, 0.01) 40%, rgba(238, 238, 238, 0.01) 60%,rgba(204, 204, 204, 0.01) 60%, rgba(204, 204, 204, 0.01) 80%,rgba(5, 5, 5, 0.01) 80%, rgba(5, 5, 5, 0.01) 100%),linear-gradient(86deg, rgba(143, 143, 143, 0.02) 0%, rgba(143, 143, 143, 0.02) 12.5%,rgba(36, 36, 36, 0.02) 12.5%, rgba(36, 36, 36, 0.02) 25%,rgba(23, 23, 23, 0.02) 25%, rgba(23, 23, 23, 0.02) 37.5%,rgba(223, 223, 223, 0.02) 37.5%, rgba(223, 223, 223, 0.02) 50%,rgba(101, 101, 101, 0.02) 50%, rgba(101, 101, 101, 0.02) 62.5%,rgba(94, 94, 94, 0.02) 62.5%, rgba(94, 94, 94, 0.02) 75%,rgba(148, 148, 148, 0.02) 75%, rgba(148, 148, 148, 0.02) 87.5%,rgba(107, 107, 107, 0.02) 87.5%, rgba(107, 107, 107, 0.02) 100%),linear-gradient(25deg, rgba(2, 2, 2, 0.02) 0%, rgba(2, 2, 2, 0.02) 16.667%,rgba(51, 51, 51, 0.02) 16.667%, rgba(51, 51, 51, 0.02) 33.334%,rgba(26, 26, 26, 0.02) 33.334%, rgba(26, 26, 26, 0.02) 50.001000000000005%,rgba(238, 238, 238, 0.02) 50.001%, rgba(238, 238, 238, 0.02) 66.668%,rgba(128, 128, 128, 0.02) 66.668%, rgba(128, 128, 128, 0.02) 83.33500000000001%,rgba(21, 21, 21, 0.02) 83.335%, rgba(21, 21, 21, 0.02) 100.002%),linear-gradient(325deg, rgba(95, 95, 95, 0.03) 0%, rgba(95, 95, 95, 0.03) 14.286%,rgba(68, 68, 68, 0.03) 14.286%, rgba(68, 68, 68, 0.03) 28.572%,rgba(194, 194, 194, 0.03) 28.572%, rgba(194, 194, 194, 0.03) 42.858%,rgba(51, 51, 51, 0.03) 42.858%, rgba(51, 51, 51, 0.03) 57.144%,rgba(110, 110, 110, 0.03) 57.144%, rgba(110, 110, 110, 0.03) 71.42999999999999%,rgba(64, 64, 64, 0.03) 71.43%, rgba(64, 64, 64, 0.03) 85.71600000000001%,rgba(31, 31, 31, 0.03) 85.716%, rgba(31, 31, 31, 0.03) 100.002%),linear-gradient(90deg, hsl(80,0%,14%),hsl(80,0%,14%));
`

const Header = styled(Text)`
  color: ${props => props.theme.gold};
  text-align: center;
  font-size: 2em;
  margin-bottom: 20px;

  @media only screen and (min-width: 768px) {
    font-size: 2.2vw;
  }
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

  @media only screen and (min-width: 768px) {
    font-size: 1vw;
    padding: 5px 10px;
    margin-bottom: ${props => props.first ? '10px' : '20px'};
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 80%;
  padding: 10px;
  margin-bottom: 10px;

  @media only screen and (min-width: 768px) {
    width: 20%;
    padding: 0;
    margin-bottom: 15px;
  }
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
      <BackDrop>
        <Form onSubmit={this.handleLogin}>
          <Header>Login</Header>
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
      </BackDrop>
    )
  }
}

export default Login;