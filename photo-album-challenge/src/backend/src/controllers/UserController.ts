import { Request, Response } from "express";

export const getUsers = (req: Request, res: Response): void => {
  res.json({ message: "Fetch all users" });
};
