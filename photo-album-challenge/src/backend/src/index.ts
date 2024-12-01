import express, { Request, Response } from "express";
import dotenv from "dotenv";
import routes from "./routes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(routes);

app.get("/", (req: Request, res: Response) => {
  res.send("API is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
