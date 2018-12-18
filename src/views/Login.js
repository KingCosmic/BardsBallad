import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import styles from '../css/Login.module.scss';

import firebase from '../firebase';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false
    }
  }

  componentDidMount() {
    this.handleLogin()

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ loggedIn: true })
      } else {
        this.setState({ loggedIn: false })
      }
    })
  }

  handleLogin() {
    firebase.auth().signInWithEmailAndPassword(
      'KingCosmicDev@gmail.com',
      'Abstuddard9311'
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
  }

  render() {
    const { loggedIn } = this.state;

    return loggedIn ? (
      <Redirect to='/' />
    )
      :
    (
      <div className={styles.container}>
        <div className={styles.box}>
          <p>Login</p>
          <input className={styles.input} type='text' placeholder='email'/>
          <input className={styles.input} type='password' placeholder='password'/>
          <button className={styles.button}>Login</button>
        </div>
      </div>
    )
  }
}

export default Login;