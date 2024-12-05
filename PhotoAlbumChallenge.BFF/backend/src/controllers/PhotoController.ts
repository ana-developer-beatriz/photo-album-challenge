import { Request, Response } from 'express';
import axios from 'axios';
import { createPhoto, getPhotos, getPhotoById, updatePhoto, deletePhoto } from '../services/photoService';
import { IPhoto } from '../models/IPhoto';

const isAuthenticated = (user: any): boolean => {
  return user && user._id;
};

export const createPhotoController = async (req: Request, res: Response): Promise<void> => {
  const { title, albumId, url, thumbnailUrl } = req.body;
  const user = req.body.user;

  if (!isAuthenticated(user)) {
    res.status(403).json({ message: 'User not authenticated' });
    return;
  }

  if (!title || !albumId || !url || !thumbnailUrl) {
    res.status(400).json({ message: 'Please provide title, albumId, url, and thumbnailUrl' });
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
      res.status(500).json({ message: 'Failed to create photo in external API' });
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

    res.status(201).json({ message: 'Photo created successfully', photo: newPhoto });
  } catch (error) {
    console.error('Error creating photo:', error);
    res.status(500).json({ message: 'Error creating photo', error: error instanceof Error ? error.message : error });
  }
};

export const getPhotosController = async (req: Request, res: Response): Promise<void> => {
  try {
    const photos = await getPhotos();
    res.status(200).json({ photos });
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ message: 'Error fetching photos', error });
  }
};

export const getPhotoByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const photo = await getPhotoById(id);

    if (!photo) {
      res.status(404).json({ message: 'Photo not found' });
      return;
    }

    res.status(200).json({ photo });
  } catch (error) {
    console.error('Error fetching photo by ID:', error);
    res.status(500).json({ message: 'Error fetching photo', error });
  }
};

export const getPhotosByAlbumController = async (req: Request, res: Response): Promise<void> => {
  const { albumId } = req.params;

  try {
    const photos = await getPhotos();
    const albumPhotos = photos.filter(photo => photo.albumId === albumId);

    if (albumPhotos.length === 0) {
      res.status(404).json({ message: 'No photos found for this album', albumId });
      return;
    }

    res.status(200).json({ albumId, photos: albumPhotos });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching photos', error });
  }
};

export const updatePhotoController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, url } = req.body;
  const user = req.body.user;

  if (!isAuthenticated(user)) {
    res.status(403).json({ message: 'User not authenticated' });
    return;
  }

  try {
    const updatedPhoto = await updatePhoto(id, { title, url });

    if (!updatedPhoto) {
      res.status(404).json({ message: 'Photo not found' });
      return;
    }

    res.status(200).json({ message: 'Photo updated successfully', photo: updatedPhoto });
  } catch (error) {
    console.error('Error updating photo:', error);
    res.status(500).json({ message: 'Error updating photo', error });
  }
};

export const deletePhotoController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const user = req.body.user;

  if (!isAuthenticated(user)) {
    res.status(403).json({ message: 'User not authenticated' });
    return;
  }

  try {
    const deleted = await deletePhoto(id);

    if (!deleted) {
      res.status(404).json({ message: 'Photo not found or you do not have permission' });
      return;
    }

    res.status(200).json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({ message: 'Error deleting photo', error });
  }
};
