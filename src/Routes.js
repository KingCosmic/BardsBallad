import React from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Login from './views/Login';
import Signup from './views/Signup';
import Home from './views/Home';

const Routes = () => {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Switch>
        <Route path='/login' component={Login} exact />
        <Route path='/signup' component={Signup} exact />
        <Route path='/' component={Home} />
      </Switch>
    </Router>
  )
}

export default Routes;