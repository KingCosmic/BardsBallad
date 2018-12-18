import React from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Login from './views/Login';
import Home from './views/Home';

const Routes = (props) => {
  return (
    <Router>
      <Switch>
        <Route path='/' component={Home} exact/>
        <Route path='/login' component={Login} exact/>
      </Switch>
    </Router>
  )
}

export default Routes;