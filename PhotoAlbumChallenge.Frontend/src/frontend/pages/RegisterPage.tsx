import React, { useState, useCallback } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setSuccess('');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message);
        setSuccess('');
        return;
      }

      setSuccess('Registration successful!');
      setError('');

      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (error) {
      console.error('Error in registration request:', error);
    }
  };

  const handleNameChange = useCallback((text: string) => setName(text), []);
  const handleEmailChange = useCallback((text: string) => setEmail(text), []);
  const handlePasswordChange = useCallback((text: string) => setPassword(text), []);
  const handleConfirmPasswordChange = useCallback((text: string) => setConfirmPassword(text), []);

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h1>Register</h1>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <InputField label='Username' placeholder='Enter your name' type='text' value={name} onChange={handleNameChange} />
        <InputField label='Email' placeholder='Enter your email' type='email' value={email} onChange={handleEmailChange} />
        <InputField label='Password' placeholder='Enter your password' type='password' value={password} onChange={handlePasswordChange} />
        <InputField
          label='Confirm Password'
          placeholder='Confirm your password'
          type='password'
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
        <Button onPress={handleSubmit} state={!!name && !!email && !!password && !!confirmPassword}>
          Register
        </Button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>
          Already have an account?{' '}
          <span onClick={() => (window.location.href = '/login')} style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}>
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}
