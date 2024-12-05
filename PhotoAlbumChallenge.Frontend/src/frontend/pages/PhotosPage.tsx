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

const PhotoDetailsPage = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [userIdFromToken, setUserIdFromToken] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isAllowedToCreate, setIsAllowedToCreate] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newUrl, setNewUrl] = useState<string>('');

  const handleError = (message: string) => setError(message);
  const handleSuccess = (message: string) => setSuccess(message);

  const fetchPhotos = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/photo/getPhotosByAlbum/${albumId}/photos`);
      if (!response.ok) {
        if (response.status === 404) {
          setIsAllowedToCreate(true);
          setPhotos([]);
          return;
        }
      }
      const { photos } = await response.json();
      setPhotos(photos || []);
      setIsAllowedToCreate(photos?.[0]?.user_id === userId);
    } catch {
      handleError('Unexpected error while fetching photo details.');
    }
  };

  const handlePhotoUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('photo', file);

    const response = await fetch('http://localhost:5000/photoUpload/upload', { method: 'POST', body: formData });
    if (response.ok) {
      const { fileUrl } = await response.json();
      setNewUrl(fileUrl);
      handleSuccess('Photo uploaded successfully!');
    } else {
      handleError('Error uploading the photo');
    }
  };

  const handleCreatePhoto = async () => {
    const token = localStorage.getItem('session_token');
    const response = await fetch('http://localhost:5000/photo/createPhotos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', session_token: token! },
      body: JSON.stringify({ title: newTitle, albumId, url: newUrl, thumbnailUrl: newUrl }),
    });
    response.ok ? handleSuccess('Photo created successfully!') : handleError('Error creating the photo.');
    fetchPhotos(userIdFromToken!);
  };

  const handleDeletePhoto = async (photoId: string) => {
    const token = localStorage.getItem('session_token');
    await fetch(`http://localhost:5000/photo/deletePhotos/${photoId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', session_token: token! },
      body: JSON.stringify({ user: userIdFromToken }),
    });
    handleSuccess('Photo was deleted successfully.');
    fetchPhotos(userIdFromToken!);
  };

  useEffect(() => {
    const token = localStorage.getItem('session_token');
    if (token) {
      try {
        const decoded = jwt_decode<{ user_id: string }>(token);
        setUserIdFromToken(decoded.user_id);
      } catch {
        handleError('Error decoding the token');
      }
    } else {
      handleError('Token not found. Please log in again');
    }
  }, []);

  useEffect(() => {
    if (userIdFromToken) fetchPhotos(userIdFromToken);
  }, [userIdFromToken, albumId]);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333' }}>Photos</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {photos.length ? (
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
              {isAllowedToCreate && (
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
              )}
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
            type='text'
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder='Título da foto'
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
            Create Photo
          </button>
        </div>
      )}
    </div>
  );
};

export default PhotoDetailsPage;
