import { useCallback, useMemo, useState } from 'react'
import Button from '@components/inputs/Button'
import TextInput from '@components/inputs/TextInput'
import Modal from '@components/Modal'
import ModalBody from '@components/Modal/Body'
import ModalHeader from '@components/Modal/Header'
import { login } from "@api/login";
import { register } from "@api/register";
import { closeModal } from '@state/modals'
import { z } from 'zod'

const passwordValidation = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long.' })
  .max(256, { message: 'Lamest DoS attack I\'ve ever seen.' })
  .regex(/.*[A-Z].*/, 'Password must contain an uppercase letter.')
  .regex(/.*[a-z].*/, 'Password must contain a lowercase letter.')
  .regex(/.*\d.*/, 'Password must contain a number.')
  .regex(
    /.*[~`!@#$%^&*()_+\-=[{\]}|\\;:'",<.>\/?].*/,
    'Password must contain a special character.',
  );

export function validatePassword(password: string) {
  return passwordValidation.safeParse(password);
}

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
    return await register(username, email, password)
  }

  const handleLogin = async () => {
    return await login(username, password)
  }

  const { success: validPassword, error: validationError } = useMemo(() => validatePassword(password), [password])

  const [subState, setSubState] = useState({ isSaving: false, saveSuccessful: false, error: '' })

  if (subState.isSaving) {
    const inProcess = (subState.isSaving && !subState.saveSuccessful && !subState.error)

    return (
      <Modal isOpen onClose={requestClose}>
        <ModalHeader title={title} onClose={requestClose} />

        <ModalBody>
          {inProcess ? (
            <h4>Authenticating...</h4>
          ) : (subState.error && !subState.saveSuccessful) ? (
            <>
              <h4>Error Authenticating.</h4>
              <p>{subState.error}</p>
            </>
          ) : (
            <h4>Authentication Successfully!.</h4>
          )}
        </ModalBody>
      </Modal>
    )
  }

  return (
    <Modal isOpen onClose={requestClose} className=''>
      <ModalHeader title={title} onClose={requestClose} />

      <ModalBody>
        <form>
          <TextInput id='username' autoComplete='username' label={isSignUp ? 'Username' : 'Username or Email'} placeholder='Username' value={username} onChange={setUsername} isValid errorMessage='' />

          {isSignUp && (
            <TextInput id='email' autoComplete='email' label='Email' placeholder='support@bardsballad.com' value={email} onChange={setEmail} isValid errorMessage='' />
          )}

          <TextInput id='password' label='Password' type='password' autoComplete={isSignUp ? 'new-password' : 'current-password'} placeholder='OogaBooga1234' value={password} onChange={setPassword} isValid={validPassword} errorMessage={validationError?.errors.map(e => e.message).join('\n') || ''} />

          {isSignUp && (
            <TextInput id='confirmPassword' autoComplete='new-password' label='Confirm Password' type='password' placeholder='OogaBooga1234' value={confirmPassword} onChange={setConfirmPassword} isValid={(confirmPassword.length === 0 || confirmPassword === password)} errorMessage={`Passwords don't match`} />
          )}

          <Button id='signup' color='primary' onClick={async () => {
            const func = isSignUp ? handleSignUp : handleLogin

            if (!validPassword) return
            
            try {
              setSubState({ isSaving: true, saveSuccessful: false, error: '' })
          
              const { success, error } = await func()
              
              setSubState({ isSaving: true, saveSuccessful: success, error: error || '' })
            } catch (e) {
              setSubState({ isSaving: true, saveSuccessful: false, error: 'Error occured during authentication, try again please.' })
            }
          }}>
            {title}
          </Button>

          <div className="flex flex-col mt-4 items-center justify-center text-sm">
            <h3>
              <span className="cursor-default dark:text-neutral-300">{isSignUp ? 'Already have an account?' : 'Don\'t have an account?'}</span>
              <span
                className="group text-fantasy-accent transition-all duration-100 ease-in-out cursor-pointer"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                <span
                  className="bg-left-bottom ml-1 bg-gradient-to-r from-fantasy-accent-light to-fantasy-accent-dark bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
                >
                  {isSignUp ? 'Login' : 'Sign Up'}
                </span>
              </span>
            </h3>
          </div>
        </form>

        <div
          className="text-neutral-500 flex text-center flex-col mt-4 items-center text-sm"
        >
          <p className="cursor-default">
            By {isSignUp ? 'signing up' : 'logging in'}, you agree to our{' '}
            <a
              className="group text-fantasy-accent transition-all duration-100 ease-in-out"
              href='https://bardsballad.com/terms-of-service'
              target='_blank'
              rel='noopener noreferrer'
            >
              <span
                className="cursor-pointer bg-left-bottom bg-gradient-to-r from-fantasy-accent-light to-fantasy-accent-dark bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
              >
                Terms of Service{' '}
              </span>
            </a>
            and{' '}
            <a
              className="group text-fantasy-accent transition-all duration-100 ease-in-out"
              href='https://bardsballad.com/privacy-policy'
              target='_blank'
              rel='noopener noreferrer'
            >
              <span
                className="cursor-pointer bg-left-bottom bg-gradient-to-r from-fantasy-accent-light to-fantasy-accent-dark bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
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

