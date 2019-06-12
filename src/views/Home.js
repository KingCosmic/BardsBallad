import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import requireAuth from '../components/requireAuth';

import Container from '../atoms/Container';
import SlideOut from '../components/SlideOut';

import Characters from '../views/Characters';
import Character from '../views/Character';

import Modal from '../components/Modal';

class Home extends Component {
  componentWillMount() {
    if (this.props.history.location.pathname === '/') this.props.history.replace('/characters')
  }

  render() {
    return (
      <Container  width='100%' height='100%' direction='row'>
        <Modal />
        <SlideOut />
        <Container width='100%' height='100%' bg='light'>
          <Switch>
            <Route path='/characters' component={Characters} exact/>
            <Route path='/characters/:characterID' component={Character} exact/>
          </Switch>
        </Container>
      </Container>
    )
  }
}

export default requireAuth(Home);