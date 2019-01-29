import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import SlideOut from './SlideOut';

import Characters from '../views/Characters';
import Character from '../views/Character';

import styles from '../css/LoggedIn.module.scss'

class LoggedIn extends Component {
  render() {
    return (
      <div className={styles.container}>
        <SlideOut />
        <div className={styles.contentContainer}>
          <Switch>
            <Route path='/characters' component={Characters} exact/>
            <Route path='/characters/:characterID' component={Character} exact/>
          </Switch>
        </div>
      </div>
    )
  }
}

export default LoggedIn;