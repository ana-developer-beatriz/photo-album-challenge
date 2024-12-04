/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

export default function MyAlbumsPage() {
  const { userId } = useParams<{ userId: string }>();
  const [albums, setAlbums] = useState<any[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchAlbums = async () => {
    const token = localStorage.getItem('session_token');
    if (!token) {
      setError('Token não encontrado. Faça login novamente.');
      return;
    }

    try {
      const decoded = jwt_decode<{ email: string; user_id: string }>(token);
      const userIdFromToken = decoded.user_id;
      const response = await fetch(`http://localhost:5000/users/users/${userIdFromToken}/albums`);

      if (response.status === 404) {
        setError('Nenhum álbum encontrado para este usuário.');
        setAlbums([]);
        return;
      }

      if (!response.ok) {
        setError('Erro ao buscar álbuns. Tente novamente mais tarde.');
        return;
      }

      const data = await response.json();
      setAlbums(data.albums);
      setError('');
    } catch (error) {
      console.error('Erro ao buscar álbuns:', error);
      setError('Erro inesperado ao buscar álbuns.');
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleCreateAlbum = async () => {
    const token = localStorage.getItem('session_token');
    if (!token) {
      alert('Token não encontrado. Faça login novamente.');
      return;
    }

    const title = prompt('Digite o título do álbum:');
    if (!title) return;

    try {
      const decoded = jwt_decode<{ email: string; user_id: string }>(token);
      const userIdFromToken = decoded.user_id;
      const response = await fetch('http://localhost:5000/album/createAlbum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          session_token: token,
        },
        body: JSON.stringify({ title, userId: userIdFromToken }),
      });

      if (response.ok) {
        alert('Álbum criado com sucesso!');
        fetchAlbums();
      } else {
        alert('Erro ao criar álbum.');
      }
    } catch (error) {
      console.error('Erro ao criar álbum:', error);
    }
  };

  const handleDeleteAlbum = async (albumId: string) => {
    const token = localStorage.getItem('session_token');
    if (!token) {
      alert('Token não encontrado. Faça login novamente.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/album/deleteAlbum/${albumId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          session_token: token,
        },
      });

      if (response.ok) {
        alert('Álbum deletado com sucesso!');
        fetchAlbums();
      } else {
        alert('Erro ao deletar álbum.');
      }
    } catch (error) {
      console.error('Erro ao deletar álbum:', error);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <h1 style={{ marginBottom: '20px', color: '#333' }}>Meus Álbuns</h1>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={handleCreateAlbum}
          style={{
            padding: '10px 15px',
            backgroundColor: 'green',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Criar Álbum
        </button>

        <button
          onClick={() => navigate('/users')}
          style={{
            padding: '10px 15px',
            backgroundColor: 'blue',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Ver Álbuns de Outros Usuários
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!error && albums.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            width: '100%',
            maxWidth: '600px',
          }}
        >
          {albums.map((album) => (
            <div
              key={album.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#f8f9fa',
                borderRadius: '10px',
                padding: '15px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '18px',
                    color: '#333',
                  }}
                >
                  {album.title}
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => navigate(`/albums/${album.id}/photos`)}
                  style={{
                    backgroundColor: '#007BFF',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '10px 15px',
                    cursor: 'pointer',
                  }}
                >
                  Ver Fotos
                </button>
                <button
                  onClick={() => handleDeleteAlbum(album.id)}
                  style={{
                    backgroundColor: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '10px 15px',
                    cursor: 'pointer',
                  }}
                >
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
