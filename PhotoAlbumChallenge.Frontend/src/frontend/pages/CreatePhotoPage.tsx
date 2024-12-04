import React, { useState } from 'react';
import PhotoUpload from '../components/PhotoUpload';

export default function CreatePhotoPage() {
  const [title, setTitle] = useState<string>('');
  const [albumId, setAlbumId] = useState<number>(1733281684687); // Seu albumId pode vir de um estado ou props
  const [base64Image, setBase64Image] = useState<string>('');

  const handleSubmit = async () => {
    if (!title || !base64Image) {
      alert('Preencha todos os campos!');
      return;
    }

    const token = localStorage.getItem('session_token');
    if (!token) {
      alert('Token não encontrado. Faça login novamente.');
      return;
    }

    const data = {
      title,
      albumId,
      url: base64Image, 
      thumbnailUrl: base64Image, 
    };

    try {
      const response = await fetch('http://localhost:5000/photo/createPhotos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          session_token: token,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Foto criada com sucesso!');
      } else {
        alert('Erro ao criar foto.');
      }
    } catch (error) {
      console.error('Erro ao enviar foto:', error);
      alert('Erro inesperado!');
    }
  };

  return (
    <div>
      <h1>Criar Foto</h1>
      <input type='text' placeholder='Título da Foto' value={title} onChange={(e) => setTitle(e.target.value)} />
      <PhotoUpload onUpload={setBase64Image} />
      <button onClick={handleSubmit}>Criar Foto</button>
    </div>
  );
}
