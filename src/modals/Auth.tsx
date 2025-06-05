import { useCallback, useMemo, useState } from 'react'
import Button from '@components/inputs/Button'
import TextInput from '@components/inputs/TextInput'
import Modal from '@components/Modal'
import ModalBody from '@components/Modal/Body'
import ModalHeader from '@components/Modal/Header'
import { login } from "@api/login";
import { register } from "@api/register";
import { closeModal } from '@state/modals'

type Props = {
  id: number
}

const AuthModal: React.FC<Props> = ({ id }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const title = useMemo(() => isSignUp ? 'Sign Up' : 'Login', [isSignUp])

  const requestClose = useCallback(() => closeModal(id), [id])

  const handleSignUp = async () => {
    await register(username, email, password)
  }

  const handleLogin = async () => {
    await login(username, password)
  }

  return (
      <Modal isOpen onClose={requestClose}>
        <ModalHeader title={title} onClose={requestClose} />
  
        <ModalBody>
          <TextInput id='username' label={isSignUp ? 'Username' : 'Username or Email'} placeholder='Username' value={username} onChange={setUsername} isValid errorMessage='' />

          {isSignUp && (
            <TextInput id='email' label='Email' placeholder='support@bardsballad.com' value={email} onChange={setEmail} isValid errorMessage='' />
          )}

          <TextInput id='password' label='Password' type='password' placeholder='OogaBooga1234' value={password} onChange={setPassword} isValid errorMessage='' />

          {isSignUp && (
            <TextInput id='confirm-password' label='Confirm Password' type='password' placeholder='OogaBooga1234' value={confirmPassword} onChange={setConfirmPassword} isValid={(confirmPassword.length === 0 || confirmPassword === password)} errorMessage={`Passwords don't match`} />
          )}

          <Button id='signup' color='primary' onClick={async () => {
            const func = isSignUp ? handleSignUp : handleLogin
            
            await func()
            requestClose()
          }}>
            {title}
          </Button>

          <div className="flex flex-col mt-4 items-center justify-center text-sm">
            <h3>
              <span className="cursor-default dark:text-neutral-300">{isSignUp ? 'Already have an account?' : 'Don\'t have an account?'}</span>
              <span
                className="group text-brand-400 transition-all duration-100 ease-in-out cursor-pointer"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                <span
                  className="bg-left-bottom ml-1 bg-gradient-to-r from-brand-400 to-brand-700 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
                >
                  {isSignUp ? 'Login' : 'Sign Up'}
                </span>
              </span>
            </h3>
          </div>

          <div
            className="text-neutral-500 flex text-center flex-col mt-4 items-center text-sm"
          >
            <p className="cursor-default">
              By {isSignUp ? 'signing up' : 'logging in'}, you agree to our{' '}
              <a
                className="group text-brand-400 transition-all duration-100 ease-in-out"
                href='https://bardsballad.com/terms-of-service'
                target='_blank'
                rel='noopener noreferrer'
              >
                <span
                  className="cursor-pointer bg-left-bottom bg-gradient-to-r from-brand-400 to-brand-700 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
                >
                  Terms of Service{' '}
                </span>
              </a>
              and{' '}
              <a
                className="group text-brand-400 transition-all duration-100 ease-in-out"
                href='https://bardsballad.com/privacy-policy'
                target='_blank'
                rel='noopener noreferrer'
              >
                <span
                  className="cursor-pointer bg-left-bottom bg-gradient-to-r from-brand-400 to-brand-700 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
                >
                  Privacy Policy
                </span>
              </a>
            </p>
          </div>
        </ModalBody>
      </Modal>
    )
}

export default AuthModal

