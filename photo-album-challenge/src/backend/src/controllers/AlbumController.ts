import { Request, Response } from 'express';
import { IAlbum } from '../models/IAlbum';
import axios from 'axios';
import { readAlbums, saveAlbums } from '../services/albumService';

export const createAlbumController = async (req: Request, res: Response): Promise<void> => {
  const { title } = req.body;
  const user = req.body.user;

  if (!user) {
    res.status(403).json({ message: 'Usuário não autenticado' });
    return;
  }

  if (!title) {
    res.status(400).json({ message: 'Por favor, forneça um título para o álbum' });
    return;
  }

  try {
    const userId = user._id;
    const response = await axios.post('https://jsonplaceholder.typicode.com/albums', { title, userId });

    if (response.status !== 201) {
      res.status(500).json({ message: 'Falha ao criar álbum na API externa' });
      return;
    }

    const albums = await readAlbums();
    const newAlbum: IAlbum = { id: String(Date.now()), userId, title };
    albums.push(newAlbum);
    await saveAlbums(albums);

    res.status(201).json({ message: 'Álbum criado com sucesso', album: newAlbum });
  } catch (error) {
    console.error('Erro ao criar álbum:', error);
    res.status(500).json({ message: 'Erro ao criar álbum', error: error instanceof Error ? error.message : error });
  }
};

export const getAlbumsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const albums = await readAlbums();
    res.status(200).json({ albums });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar álbuns', error });
  }
};

export const getAlbumByIdController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const albums = await readAlbums();
    const album = albums.find((a) => a.id === id);

    if (!album) {
      res.status(404).json({ message: 'Álbum não encontrado' });
      return;
    }

    res.status(200).json({ album });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar álbum', error });
  }
};

export const updateAlbumController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title } = req.body;

  if (!title) {
    res.status(400).json({ message: 'Por favor, forneça um título' });
    return;
  }

  try {
    const albums = await readAlbums();
    const index = albums.findIndex((a) => a.id === id);

    if (index === -1) {
      res.status(404).json({ message: 'Álbum não encontrado', id });
      return;
    }

    albums[index].title = title;
    await saveAlbums(albums);

    res.status(200).json({ message: 'Álbum atualizado com sucesso', album: albums[index] });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar álbum', error });
  }
};

export const deleteAlbumController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const albums = await readAlbums();
    const index = albums.findIndex((a) => a.id === id);

    if (index === -1) {
      res.status(404).json({ message: 'Álbum não encontrado' });
      return;
    }

    albums.splice(index, 1);
    await saveAlbums(albums);

    res.status(200).json({ message: 'Álbum deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar álbum', error });
  }
};
