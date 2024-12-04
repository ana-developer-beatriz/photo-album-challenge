import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { IPhoto } from '../models/IPhoto';
import path from 'path';

const filePath = path.join(__dirname, '../db/photos.json');

//const filePath = "../db/photos.json";

async function readData(): Promise<IPhoto[]> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error === 'ENOENT') {
      console.log(error);
      return [];
    }
    throw error;
  }
}

async function writeData(data: IPhoto[]): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function createPhoto(photo: Omit<IPhoto, 'id'>): Promise<IPhoto> {
  const photos = await readData();
  const newPhoto: IPhoto = {
    ...photo,
    id: uuidv4(),
  };
  photos.push(newPhoto);
  await writeData(photos);
  return newPhoto;
}

export async function getPhotos(): Promise<IPhoto[]> {
  return await readData();
}

export async function getPhotoById(id: string): Promise<IPhoto | undefined> {
  const photos = await readData();
  return photos.find((photo) => photo.id === id);
}

export async function updatePhoto(id: string, updatedFields: Partial<IPhoto>): Promise<IPhoto | null> {
  const photos = await readData();
  const index = photos.findIndex((photo) => photo.id === id);

  if (index === -1) {
    return null;
  }

  const updatedPhoto = {
    ...photos[index],
    ...updatedFields,
  };

  photos[index] = updatedPhoto;
  await writeData(photos);
  return updatedPhoto;
}

export async function deletePhoto(id: string): Promise<boolean> {
  const photos = await readData();
  const filteredPhotos = photos.filter((photo) => photo.id !== id);

  if (filteredPhotos.length === photos.length) {
    return false;
  }

  await writeData(filteredPhotos);
  return true;
}
