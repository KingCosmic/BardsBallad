import Button from '../components/inputs/Button';
import TextInput from '../components/inputs/TextInput';
import { useState } from 'react';
import { authState } from '../state/auth';
import { Navigate } from 'react-router';
import { register, login } from '../lib/api';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(true);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const auth = authState.useValue();

  if (auth.isLoggedIn) {
    return <Navigate to='/characters' />
  }

  const handleSignUp = async () => {
    await register(username, email, password)
  }

  const handleLogin = async () => {
    await login(username, password)
  }

  return (
    <div
      className="flex font-poppins items-center justify-center min-w-full min-h-full"
    >
      <div className="grid gap-8">
        <div
          id="back-div"
          className="bg-gradient-to-r from-brand-500 to-brand-700 rounded-[26px] m-4"
        >
          <div
            className="border-[20px] border-transparent rounded-[20px] dark:bg-neutral-900 bg-white shadow-lg xl:p-10 2xl:p-10 lg:p-10 md:p-10 sm:p-2 m-2"
          >
            <h1 className="pt-8 pb-6 font-bold text-5xl dark:text-neutral-400 text-center cursor-default">
              {isSignUp ? 'Sign Up' : 'Log In'}
            </h1>
            <div className='space-y-4'>
              <TextInput id='username' label='Username' placeholder='Username' value={username} onChange={setUsername} isValid errorMessage='' />

              {isSignUp && (
                <TextInput id='email' label='Email' placeholder='support@bardsballad.com' value={email} onChange={setEmail} isValid errorMessage='' />
              )}

              <TextInput id='password' label='Password' placeholder='OogaBooga1234' value={password} onChange={setPassword} isValid errorMessage='' />
              
              <Button id='signup' color='primary' onClick={isSignUp ? handleSignUp : handleLogin}>
                {isSignUp ? 'Sign Up' : 'Log In'}
              </Button>
            </div>

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
                    {isSignUp ? 'Log In' : 'Sign Up'}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;