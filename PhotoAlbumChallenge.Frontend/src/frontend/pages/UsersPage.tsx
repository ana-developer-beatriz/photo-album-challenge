import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/users/listUsers');
        if (!response.ok) {
          throw new Error('Failed to load users.');
        }

        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        setError('Error loading users.');
      }
    };
    fetchUsers();
  }, []);

  const handleUserClick = (userId: string) => {
    navigate(`/albums/${userId}`);
  };

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '20px auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
        backgroundColor: '#f9f9f9',
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          color: '#333',
          marginBottom: '20px',
          fontSize: '24px',
        }}
      >
        User List
      </h1>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {users.map((user) => (
          <li
            key={user.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '10px',
              marginBottom: '15px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div>
              <strong style={{ fontSize: '18px', color: '#555' }}>{user.name}</strong>
              <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>{user.email}</p>
            </div>
            <Button
              onPress={() => handleUserClick(user.id)}
              state={true}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '5px',
                fontSize: '14px',
                cursor: 'pointer',
                border: 'none',
                alignSelf: 'flex-start',
                marginTop: '10px',
              }}
            >
              View Albums
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
