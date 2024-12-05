/*eslint-disable */
import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { useParams } from 'react-router-dom';
import PhotoUpload from '../components/PhotoUpload';

interface Photo {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  user_id: string;
}

export default function PhotoDetailsPage() {
  const { albumId } = useParams<{ albumId: string }>();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [userIdFromToken, setUserIdFromToken] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isAllowedToCreate, setIsAllowedToCreate] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newUrl, setNewUrl] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('session_token');
    if (!token) {
      setError('Token not found. Please log in again');
      return;
    }

    try {
      const decoded = jwt_decode<{ user_id: string }>(token);
      setUserIdFromToken(decoded.user_id);
    } catch (error) {
      setError('Error decoding the token');
    }
  }, []);

  useEffect(() => {
    if (userIdFromToken) {
      fetchPhotoDetails(userIdFromToken);
    }
  }, [userIdFromToken, albumId]);

  const fetchPhotoDetails = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/photo/getPhotosByAlbum/${albumId}/photos`);
      if (!response.ok){
        if (response.status == 404) {
          setIsAllowedToCreate(true);
          setPhotos([]);
          return;
        }
      }
     const data = await response.json();
      const photos = data.photos || [];
      setPhotos(photos);

      if (photos[0].user_id === userId) {
        setIsAllowedToCreate(true);
      } else {
        setIsAllowedToCreate(false);
      }
    } catch (error) {
      setError('Unexpected error while fetching photo details.');
    }
  };
  const handlePhotoUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await fetch('http://localhost:5000/photoUpload/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setNewUrl(data.fileUrl);
        
        setSuccess('Photo uploaded successfully!');
      } else {
        setError('Error uploading the photo');
      }
    } catch (error) {
      setError('Unexpected error while uploading the photo');
    }
  };
  const handleCreatePhoto = async () => {
    const token = localStorage.getItem('session_token');
    const response = await fetch('http://localhost:5000/photo/createPhotos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        session_token: `${token}`,
      },
      body: JSON.stringify({
        title: newTitle,
        albumId: albumId,
        url: newUrl,
        thumbnailUrl: newUrl,
      }),
    });

    if (response.ok) {
      setSuccess('Photo created successfully!');
      fetchPhotoDetails(userIdFromToken!);
    } else {
      setError('Error creating the photo.');
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    const token = localStorage.getItem('session_token');
    const photoToDelete = photos.find((photo) => photo.id === photoId);
    const response = await fetch(`http://localhost:5000/photo/deletePhotos/${photoId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        session_token: `${token}`,
      },
      body: JSON.stringify({
        user: userIdFromToken
      }),
    });

    if (response.ok) {
      setSuccess('Photo was deleted successfully.');
      fetchPhotoDetails(userIdFromToken!);
    } else {
      setError('Error to delete photo.');
    }
  };
  return(
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333' }}>Detalhes das Fotos</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {photos.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '10px',
            justifyContent: 'center',
          }}
        >
          {photos.map((photo) => (
            <div key={photo.id} style={{ textAlign: 'center' }}>
              <img
                src={photo.url}
                alt={photo.title}
                style={{
                  width: '100%',
                  maxWidth: '150px',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                }}
              />
              <p style={{ marginTop: '10px', fontSize: '14px', color: '#555' }}>{photo.title}</p>
              <button
                onClick={() => handleDeletePhoto(photo.id)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'red',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Delete Photo
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: '#777' }}>No photos found. Create a new photo:</p>
      )}

      {isAllowedToCreate && (
        <div style={{ marginTop: '40px' }}>
          <h3 style={{ color: '#333' }}>Upload new photo:</h3>
          <PhotoUpload onUpload={handlePhotoUpload} />
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Título da foto"
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', marginBottom: '10px' }}
          />
          <button
            onClick={handleCreatePhoto}
            style={{
              padding: '10px 20px',
              backgroundColor: 'green',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Criar Foto
          </button>
        </div>
      )}
    </div>
  );
}
