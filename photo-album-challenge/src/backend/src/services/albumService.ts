import fs from "fs/promises";
import path from "path";
import { IAlbum } from "../models/IAlbum";

const albumsFilePath = path.resolve(__dirname, "../db/albums.json");

export async function readAlbums(): Promise<IAlbum[]> {
  try {
    const data = await fs.readFile(albumsFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

export async function saveAlbums(albums: IAlbum[]): Promise<void> {
  await fs.writeFile(albumsFilePath, JSON.stringify(albums, null, 2));
}
