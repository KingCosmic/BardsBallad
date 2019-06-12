import React, { Component } from 'react';
import styled from 'styled-components';

import { Link as L } from "react-router-dom";

import Container from '../atoms/Container';
import Form from '../atoms/Form';
import Input from '../atoms/Input';
import Title from '../atoms/Title';
import Text from '../atoms/Text';

import styles from '../css/Login.module.scss';

import api from '../api';

const Link = styled(L)`
  color: rgba(255, 255, 255, .6);
`

const Background = styled(Container)`
  background-color: ${props => props.theme.almostblack};
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

  handleSignup(event) {
    const { email, password } = this.state;

    api.signup(
      email,
      password
    ).then(resp => {

      this.props.history.replace('/characters');

    }).catch(alert)

    event.preventDefault();
  }

  render() {

    return (
      <Background width='100%' height='100%' justifyContent='center' alignItems='center'>
        <Form width='400px' height='auto' alignItems='center' onSubmit={this.handleSignup}>
          <Title>Signup</Title>
          <Input margin='5px'
            type='text' value={this.state.email} placeholder='email'
            onChange={this.handleEmail}
          />

          <Input margin='5px'
            type='password' value={this.state.password} placeholder='password'
            onChange={this.handlePass}
          />
          <button className={styles.button}>Signup</button>
        </Form>

        <Text>Need to <Link to={`/login`}>login?</Link></Text>
      </Background>
    )
  }
}

export default Signup;