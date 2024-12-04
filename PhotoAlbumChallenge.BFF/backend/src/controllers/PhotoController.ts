import { Request, Response } from 'express';
import axios from 'axios';
import { createPhoto, getPhotos, getPhotoById, updatePhoto, deletePhoto } from '../services/photoService';
import { IPhoto } from '../models/IPhoto';

export const createPhotoController = async (req: Request, res: Response): Promise<void> => {
  const { title, albumId, url, thumbnailUrl } = req.body;
  const user = req.body.user;

  if (!user) {
    res.status(403).json({ message: 'Usuário não autenticado' });
    return;
  }

  if (!title || !albumId || !url || !thumbnailUrl) {
    res.status(400).json({ message: 'Por favor, forneça título, albumId, url e thumbnailUrl' });
    return;
  }

  try {
    const userId = user._id;

    const response = await axios.post<IPhoto>('https://jsonplaceholder.typicode.com/photos', {
      title,
      albumId,
      url,
      thumbnailUrl,
    });

    if (response.status !== 201) {
      res.status(500).json({ message: 'Falha ao criar foto na API externa' });
      return;
    }

    const { id, title: photoTitle, albumId: photoAlbumId, url: photoUrl, thumbnailUrl: photoThumbnailUrl } = response.data;

    const newPhoto = await createPhoto({
      title: photoTitle,
      albumId: String(photoAlbumId),
      url: photoUrl,
      thumbnailUrl: photoThumbnailUrl,
      user_id: userId,
    });

    res.status(201).json({ message: 'Foto criada com sucesso', photo: newPhoto });
  } catch (error) {
    console.error('Erro ao criar foto:', error);
    res.status(500).json({ message: 'Erro ao criar foto', error: error instanceof Error ? error.message : error });
  }
};

export const getPhotosController = async (req: Request, res: Response): Promise<void> => {
  try {
    const photos = await getPhotos();
    res.status(200).json({ photos });
  } catch (error) {
    console.error('Erro ao buscar fotos:', error);
    res.status(500).json({ message: 'Erro ao buscar fotos', error });
  }
};

export const getPhotoByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const photo = await getPhotoById(id);

    if (!photo) {
      res.status(404).json({ message: 'Foto não encontrada' });
      return;
    }

    res.status(200).json({ photo });
  } catch (error) {
    console.error('Erro ao buscar foto por ID:', error);
    res.status(500).json({ message: 'Erro ao buscar foto', error });
  }
};

export const getPhotosByAlbumController = async (req: Request, res: Response): Promise<void> => {
  const { albumId } = req.params;

  try {
    const photos = await getPhotos();
    const albumPhotos = photos.filter(photo => photo.albumId === albumId);

    if (albumPhotos.length === 0) {
      res.status(404).json({ message: 'Nenhuma foto encontrada para este álbum', albumId });
      return;
    }

    res.status(200).json({ albumId, photos: albumPhotos });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar fotos', error });
  }
};

export const updatePhotoController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, url } = req.body;
  const user = req.body.user;

  if (!user) {
    res.status(403).json({ message: 'Usuário não autenticado' });
    return;
  }

  try {
    const updatedPhoto = await updatePhoto(id, { title, url });

    if (!updatedPhoto) {
      res.status(404).json({ message: 'Foto não encontrada' });
      return;
    }

    res.status(200).json({ message: 'Foto atualizada com sucesso', photo: updatedPhoto });
  } catch (error) {
    console.error('Erro ao atualizar foto:', error);
    res.status(500).json({ message: 'Erro ao atualizar foto', error });
  }
};

export const deletePhotoController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const user = req.body.user;

  if (!user) {
    res.status(403).json({ message: 'Usuário não autenticado' });
    return;
  }

  try {
    const deleted = await deletePhoto(id);

    if (!deleted) {
      res.status(404).json({ message: 'Foto não encontrada ou você não tem permissão' });
      return;
    }

    res.status(200).json({ message: 'Foto deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar foto:', error);
    res.status(500).json({ message: 'Erro ao deletar foto', error });
  }
};
