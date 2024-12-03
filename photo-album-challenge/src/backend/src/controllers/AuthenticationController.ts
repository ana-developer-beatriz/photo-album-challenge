import express from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import { IUser } from '../models/IUser';

const { JWT_SECRET } = process.env;
const filePath = path.resolve(__dirname, '../db/users.json');

async function readUsers(): Promise<IUser[]> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeUsers(users: IUser[]): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(users, null, 2));
}

export default class AuthController {
  static async authenticate(req: express.Request, res: express.Response) {
    const { session_token } = req.body;

    if (!session_token) {
      return res.status(400).json({ message: 'Token não presente' });
    }

    const users = await readUsers();
    const user = users.find((u) => u.session_token === session_token);

    if (!user) {
      return res.status(400).json({ message: 'Token inválido' });
    }

    res.status(200).json({ message: 'Autenticado com sucesso', user });
  }

  static async validateToken(req: express.Request, res: express.Response) {
    let { session_token } = req.headers;

    if (!session_token) {
      return res.status(400).json({ message: 'Token não presente' });
    }

    if (Array.isArray(session_token)) {
      session_token = session_token[0];
    }

    jwt.verify(session_token, JWT_SECRET as string, async (err, decodedPayload) => {
      if (err) {
        return res.status(403).json({ message: 'Token inválido' });
      }

      if (!decodedPayload || typeof decodedPayload === 'string') {
        return res.status(403).json({ message: 'Token inválido' });
      }

      const users = await readUsers();
      const user = users.find((u) => u.email === (decodedPayload as JwtPayload).email);

      if (!user || user.session_token !== session_token) {
        return res.status(403).json({ message: 'Token inválido' });
      }

      if (!(decodedPayload as JwtPayload).exp || (decodedPayload as JwtPayload).exp! < Date.now() / 1000) {
        user.session_token = '';
        await writeUsers(users);
        return res.status(403).json({ message: 'Token expirado' });
      }

      const publicUser = {
        name: user.name,
        email: user.email,
        session_token: user.session_token,
        role: user.role,
        active: user.active,
      };

      return res.status(200).json({ message: 'Token válido', user: publicUser });
    });
  }
}
