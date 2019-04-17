import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import requireAuth from '../components/requireAuth';

import SlideOut from '../components/SlideOut';

import Characters from '../views/Characters';
import Character from '../views/Character';

import styles from '../css/LoggedIn.module.scss'
import Modal from '../components/Modal';

class Home extends Component {
  render() {
    return (
      <div className={styles.container}>
        <Modal />
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

export default requireAuth(Home);