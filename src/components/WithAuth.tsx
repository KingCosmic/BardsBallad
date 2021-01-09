import React, { useEffect, ElementType } from 'react'
import { navigate } from 'gatsby'

import { authState } from '../state/auth'

const withAuth = (AuthComponent: ElementType<any>) => {
  function AuthWrapped(props: object) {
    const { isLoggedIn } = authState.useValue()

    useEffect(() => {
      if (!isLoggedIn) {
        navigate('/login')
      }
    }, [])

    return isLoggedIn ? <AuthComponent {...props} /> : null
  }

  return AuthWrapped
}

export default withAuth
