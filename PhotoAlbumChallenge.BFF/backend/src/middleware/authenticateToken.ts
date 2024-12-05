import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/IUser';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

const usersFilePath = path.resolve(__dirname, '../db/users.json');

async function readUsers(): Promise<IUser[]> {
  try {
    const data = await fs.readFile(usersFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const session_token = Array.isArray(req.headers.session_token) ? req.headers.session_token[0] : req.headers.session_token;

    if (!session_token) {
      res.status(400).json({ message: 'Token não presente' });
      return;
    }

    const decoded = jwt.verify(session_token, JWT_SECRET);

    if (typeof decoded !== 'object' || !decoded.email) {
      res.status(403).json({ message: 'Token inválido' });
      return;
    }

    const users = await readUsers();
    const user = users.find((u) => u.email === decoded.email);

    if (!user || user.session_token !== session_token) {
      res.status(403).json({ message: 'Token inválido session token' });
      return;
    }

    req.body.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Erro ao validar token', error });
  }
};
