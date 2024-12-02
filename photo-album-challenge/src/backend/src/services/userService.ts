import fs from "fs/promises";
import { IUser } from "../models/IUser";
import path from "path";


const filePath = path.join(__dirname, "../db/users.json");

export async function getUsers(): Promise<IUser[]> {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error === "ENOENT") {
      return [];
    }
    throw error;
  }
}

export async function saveUsers(users: IUser[]): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(users, null, 2));
}

export async function updateUser(id: string, updatedFields: Partial<IUser>): Promise<IUser | null> {
  const users = await getUsers();
  const index = users.findIndex((user) => user._id === id);

  if (index === -1) {
    return null;
  }

  const updatedUser = { ...users[index], ...updatedFields };
  users[index] = updatedUser;

  await saveUsers(users);
  return updatedUser;
}
