import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import cors, { CorsOptions } from 'cors';
import photoRoutes from './routes/photoRoutes';
import { signupController } from './controllers/UserController';
import { loginController } from './controllers/UserController';
import  uploadPhotoRoutes  from './routes/uploadPhotoRoutes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedLocalNetwork =
      /^(https:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d{1,5})?|https:\/\/[a-zA-Z0-9-]+\.github\.io|http:\/\/localhost(:\d{1,5})?)$/;

    if (!origin || allowedLocalNetwork.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['*'],
  // credentials: true,
};

export default corsOptions;

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));

app.use(routes);
app.use('/photo', photoRoutes);
app.post('/signup', signupController);
app.post('/login', loginController);
app.use('/photoUpload', uploadPhotoRoutes);


app.get('/', (req: Request, res: Response) => {
  res.send('API is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

