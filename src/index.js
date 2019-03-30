import React from 'react';
import { Grommet } from 'grommet';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import './css/fonts.scss';
import './index.css';

import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware  } from 'redux';
import reduxThunk from "redux-thunk";
import App from './App';

import reducers from './reducers/index';
import theme from './theme';

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Provider store={createStore(reducers, {}, applyMiddleware(reduxThunk))}>
      <App />
    </Provider>
  </ThemeProvider>

  , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
