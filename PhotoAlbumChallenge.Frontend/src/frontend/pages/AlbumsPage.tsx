import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function AlbumsPage() {
  const { userId } = useParams<{ userId: string }>();
  const [albums, setAlbums] = useState<any[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch(`http://localhost:5000/users/users/${userId}/albums`);
        if (!response.ok) {
          throw new Error('Failed to fetch albums');
        }
        const data = await response.json();
        setAlbums(data.albums);
      } catch (error) {
        setError('There is no album to this user');
      }
    };
    fetchAlbums();
  }, [userId]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <h1 style={{ marginBottom: '20px', color: '#333' }}>Albums</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

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
            <button
              onClick={() => navigate(`/albums/${album.id}/photos`)}
              style={{
                backgroundColor: '#007BFF',
                color: '#FFF',
                border: 'none',
                borderRadius: '5px',
                padding: '10px 15px',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              View Photos
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
