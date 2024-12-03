// src/pages/RegisterPage.tsx
import React, { useState, useCallback } from 'react';
import InputField from '../components/InputField.tsx';
import Button from '../components/Button.tsx';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  //const [buttonState, setButtonState] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validação
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
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

      setSuccess('Registro efetuado com sucesso!');
      setError('');

      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (error) {
      console.error('Erro na requisição de registro:', error);
    }
  };

  const handleNameChange = useCallback((text: string) => setName(text), []);
  const handleEmailChange = useCallback((text: string) => setEmail(text), []);
  const handlePasswordChange = useCallback((text: string) => setPassword(text), []);
  const handleConfirmPasswordChange = useCallback((text: string) => setConfirmPassword(text), []);

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h1>Registre-se</h1>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <InputField label='Nome de Usuário' placeholder='Digite seu nome' type='text' value={name} onChange={handleNameChange} />
        <InputField label='E-mail' placeholder='Digite seu e-mail' type='email' value={email} onChange={handleEmailChange} />
        <InputField label='Senha' placeholder='Digite sua senha' type='password' value={password} onChange={handlePasswordChange} />
        <InputField
          label='Confirme sua Senha'
          placeholder='Confirme sua senha'
          type='password'
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
        <Button onPress={handleSubmit} state={!!name && !!email && !!password && !!confirmPassword}>
          Registrar
        </Button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>
          Já possui uma conta?{' '}
          <span onClick={() => (window.location.href = '/login')} style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}>
            Faça login
          </span>
        </p>
      </div>
    </div>
  );
}
