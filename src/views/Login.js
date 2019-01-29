import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';

import Container from '../atoms/Container';
import Form from '../atoms/Form';
import Input from '../atoms/Input';
import Title from '../atoms/Title';

import styles from '../css/Login.module.scss';

import firebase from '../firebase';

const Background = styled(Container)`
  background-color: ${props => props.theme.almostblack};
`

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      email: '',
      password: ''
    }

    this.handleEmail = this.handleEmail.bind(this);
    this.handlePass = this.handlePass.bind(this);
  }

  handleEmail(event) {
    this.setState({ email: event.target.value });
  }

  handlePass(event) {
    this.setState({ password: event.target.value });
  }

  componentDidMount() {
    //this.handleLogin()

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ loggedIn: true })
      } else {
        this.setState({ loggedIn: false })
      }
    })
  }

  handleLogin(event) {
    const { email, password } = this.state;

    firebase.auth().signInWithEmailAndPassword(
      email,
      password
    ).catch((error) => {
      // Handle errors
      const errorCode = error.code;
      const errorMessage = error.message;

      if (errorCode === 'auth/wrong-password') {
        alert('Wrong Password')
      } else {
        alert(errorMessage)
      }
      
      console.log(error);
    })

    event.preventDefault();
  }

  render() {
    const { loggedIn } = this.state;

    return loggedIn ? (
      <Redirect to='/' />
    )
      :
    (
      <Background width='100%' height='100%' justifyContent='center' alignItems='center'>
        <Form width='400px' height='auto' alignItems='center' onSubmit={this.handleLogin}>
          <Title>Login</Title>
          <Input margin='5px'
            type='text' value={this.state.email} placeholder='email'
            onChange={this.handleEmail}
          />

          <Input margin='5px'
            type='password' value={this.state.password} placeholder='password'
            onChange={this.handlePass}
          />
          <button className={styles.button}>Login</button>
        </Form>
      </Background>
    )
  }
}

const mapStateToProps = (state) => {
  return {

  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));