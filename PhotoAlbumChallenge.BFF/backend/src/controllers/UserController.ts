import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/IUser';
import { getUsers, saveUsers } from '../services/userService';
import dotenv from 'dotenv';

const saltRounds = 10;
dotenv.config();
const { JWT_SECRET } = process.env;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the .env file');
}

export const signupController = async (req: Request, res: Response): Promise<void> => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Por favor, forneça todos os campos obrigatórios (email, password, name)' });
    return;
  }

  try {
    const users = await getUsers();

    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      res.status(400).json({ message: 'Este e-mail já está registrado' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser: IUser = {
      _id: String(Date.now()),
      name,
      email,
      password_hash: hashedPassword,
      role: '',
      active: false,
      session_token: '',
    };

    const sessionToken = jwt.sign({ email: newUser.email, user_id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

    newUser.session_token = sessionToken;

    users.push(newUser);
    await saveUsers(users);

    res.status(201).json({ message: 'Usuário criado com sucesso', user: newUser, session_token: sessionToken });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar usuário', error });
  }
};

export const loginController = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Por favor, forneça email e senha' });
    return;
  }

  try {
    const users = await getUsers();

    const user = users.find((user) => user.email === email);
    if (!user) {
      res.status(400).json({ message: 'Usuário não encontrado' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      res.status(400).json({ message: 'Senha inválida' });
      return;
    }

    const sessionToken = jwt.sign({ user_id: user._id, email: user.email }, JWT_SECRET as string, { expiresIn: '1h' });

    user.session_token = sessionToken;
    await saveUsers(users);

    res.status(200).json({ message: 'Login bem-sucedido', session_token: sessionToken });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login', error });
  }
};

export const getUsersController = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await getUsers();
    const userSummaries = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
    }));

    res.status(200).json({ users: userSummaries });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários', error });
  }
};
