import React, { useState, useEffect, useCallback } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordIsValid, setPasswordIsValid] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [buttonState, setButtonState] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message);
        setSuccess('');
        return;
      }
      const data = await response.json();
      const sessionToken = data.session_token;

      if (sessionToken) {
        localStorage.setItem('session_token', sessionToken);
        setSuccess('Login successful!');
        setError('');

        setTimeout(() => {
          window.location.href = '/myAlbums/';
        }, 1000);
      } else {
        setError('Authorization header not found');
        setSuccess('');
      }
    } catch (error) {
      console.error('Error in the login request:', error);
    }
  };

  useEffect(() => {
    if (email && password) {
      setEmailIsValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
      setPasswordIsValid(password.length >= 8);
      handleButtonState();
    }
  }, [email, password]);

  const handleButtonState = useCallback(() => {
    if (emailIsValid && passwordIsValid) {
      setButtonState(true);
    } else {
      setButtonState(false);
    }
  }, [emailIsValid, passwordIsValid]);

  const handleEmailChange = useCallback(
    (text: string) => {
      setEmail(text);
      setEmailIsValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text));
      handleButtonState();
    },
    [setEmail, setEmailIsValid]
  );

  const handlePasswordChange = useCallback(
    (text: string) => {
      setPassword(text);
      setPasswordIsValid(text.length >= 8);
      handleButtonState();
    },
    [setPassword, setPasswordIsValid]
  );

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h1>Login</h1>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <InputField label='E-mail' placeholder='Enter your email' type='email' value={email} onChange={handleEmailChange} />
        <InputField label='Senha' placeholder='Enter your password' type='password' value={password} onChange={handlePasswordChange} />
        <Button onPress={handleSubmit} state={buttonState}>
          Login
        </Button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button onPress={() => (window.location.href = '/register')} state={true}>
          Sign Up
        </Button>
      </div>
    </div>
  );
}
