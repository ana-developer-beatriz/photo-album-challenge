import fs from 'fs/promises';
import path from 'path';
import { IAlbum } from '../models/IAlbum';
import { createAlbumInApi } from '../api/jsonPlaceholderApi';

const albumsFilePath = path.resolve(__dirname, '../db/albums.json');

export async function readAlbums(): Promise<IAlbum[]> {
  try {
    const data = await fs.readFile(albumsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}
export async function saveAlbums(albums: IAlbum[]): Promise<void> {
  await fs.writeFile(albumsFilePath, JSON.stringify(albums, null, 2));
}
export const createAlbum = async (title: string, userId: string): Promise<IAlbum> => {
  const externalAlbum = await createAlbumInApi(title, userId) as IAlbum;
  const albums = await readAlbums();
  const newAlbum: IAlbum = { id: String(Date.now()), userId, title: externalAlbum.title };
  albums.push(newAlbum);
  await saveAlbums(albums);

  return newAlbum;
};
