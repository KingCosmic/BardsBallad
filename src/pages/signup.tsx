import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { navigate } from 'gatsby'

// @ts-ignore
import backgroundLink from '../images/loginbg.jpg'

import { Link as L } from 'gatsby'

import Button from '../components/Button'

import { authState, signup } from '../state/auth'

const Text = styled.p`
  font-size: 1.3em;
  width: 100%;
  text-align: center;

  @media only screen and (min-width: 768px) {
    font-size: 1em;

    margin-top: 15px;
  }
`

const BackDrop = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: url(${() => backgroundLink}) no-repeat center center;
  background-size: 100%;
`

const Header = styled.p`
  color: ${props => props.theme.gold};
  text-align: center;
  font-size: 2em;
  margin-bottom: 20px;

  @media only screen and (min-width: 768px) {
    font-size: 2.2vw;
  }
`

const Link = styled(L)`
  color: rgba(255, 255, 255, 0.6);
`

type InputProps = {
  first?: boolean
}

const Input = styled.input<InputProps>`
  margin-bottom: ${props => (props.first ? '15px' : '20px')};
  padding: 10px;
  color: rgba(20, 20, 20, 0.85);
  border: none;
  appearance: none;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border-radius: 4px;
  font-size: 1em;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
  }

  @media only screen and (min-width: 768px) {
    font-size: 1vw;
    padding: 5px 10px;
    margin-bottom: ${props => (props.first ? '10px' : '20px')};
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 80%;
  padding: 10px;
  margin-bottom: 10px;

  @media only screen and (min-width: 768px) {
    width: calc(20% + 20px);
  }
`

async function handleSignup(
  event: any,
  email: string,
  password: string) {
  signup(email, password)
    .then(() => {
      navigate('/login')
    })
    .catch(alert => {
      // TODO: Show Alert telling them authentication failed, and why.
    })

  event.preventDefault()
}

function Signup() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const state = authState.useValue()

  useEffect(() => {
    if (state.isLoggedIn) navigate('/app/creations')
  }, [state.isLoggedIn])

  return (
    <BackDrop>
      <Form onSubmit={e => handleSignup(e, email, password)}>
        <Header>Signup</Header>

        <Input
          first
          placeholder="JohnDoe"
          type="text"
          value={username}
          onChange={event => setUsername(event.target.value)}
        />

        <Input
          first
          placeholder="JohnDoe@example.com"
          type="text"
          value={email}
          onChange={event => setEmail(event.target.value)}
        />

        <Input
          placeholder="password"
          type="password"
          value={password}
          onChange={event => setPassword(event.target.value)}
        />
        <Button onClick={e => handleSignup(e, email, password)}>Signup</Button>

        <Text>
          Have an account already? <Link to="/login">login</Link>
        </Text>
      </Form>
    </BackDrop>
  )
}

export default Signup