import React, { MouseEventHandler } from 'react';

interface ButtonProps {
  onPress: MouseEventHandler<HTMLButtonElement>;
  state: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({ onPress, state, children }) => (
  <button
    onClick={onPress}
    disabled={!state}
    style={{
      width: '100%',
      padding: '10px',
      backgroundColor: state ? '#4CAF50' : '#ccc',
      color: '#fff',
      border: 'none',
      cursor: state ? 'pointer' : 'not-allowed',
      borderRadius: '4px',
    }}
  >
    {children}
  </button>
);

export default Button;
