import React, { Component } from 'react';

import api from '../api';

const withAuth = (AuthComponent) => {

  class AuthWrapped extends Component {
    constructor(props) {
      super(props);

      this.state = {
        user: false
      }

    }

    UNSAFE_componentWillMount() {
      if (!api.loggedIn()) {
        this.props.history.replace('/login')
      }
      else {
        try {
          const profile = api.getProfile()
          this.setState({
            user: profile
          })
        }
        catch (err) {
          api.logout()
          this.props.history.replace('/login')
        }
      }
    }

    render() {
      const { user } = this.state;

      return user ? <AuthComponent history={this.props.history} /> : null
    }

  }

  return AuthWrapped;
}

export default withAuth;