import React, { useState } from 'react';

interface PhotoUploadProps {
  albumId: number;
  onUploadSuccess: () => void;
}

export default function PhotoUpload({ albumId, onUploadSuccess }: PhotoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const convertToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); 
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Nenhuma imagem selecionada.');
      return;
    }

    try {
      const base64 = await convertToBase64(selectedFile);

      const response = await fetch('http://localhost:5000/photo/createPhotos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          session_token: localStorage.getItem('session_token') || '',
        },
        body: JSON.stringify({
          title: selectedFile.name,
          albumId,
          url: base64, 
          thumbnailUrl: base64, 
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar a foto.');
      }

      setMessage('Foto enviada com sucesso!');
      setSelectedFile(null);
      setPreview(null);
      onUploadSuccess();
    } catch (error) {
      setMessage('Erro ao enviar a foto.');
      console.error(error);
    }
  };

  return (
    <div>
      <h3>Upload de Foto</h3>
      <input type='file' onChange={handleFileChange} accept='image/*' />
      {preview && <img src={preview} alt='Pré-visualização' style={{ width: '150px', marginTop: '10px' }} />}
      <button
        onClick={handleUpload}
        style={{
          marginTop: '10px',
          padding: '10px',
          backgroundColor: '#007BFF',
          color: '#FFF',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Enviar Foto
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
