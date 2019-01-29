import React from 'react';
import { createStore } from 'redux';

import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './views/Home';
import Login from './views/Login';

import reducers from './reducers/index.ts';

const Routes = (props) => {
  return (
    <Provider store={createStore(reducers)}>
      <Router>
        <Switch>
          <Route path='/login' component={Login} exact/>
          <Route path='/' component={Home} />
        </Switch>
      </Router>
    </Provider>
  )
}

export default Routes;