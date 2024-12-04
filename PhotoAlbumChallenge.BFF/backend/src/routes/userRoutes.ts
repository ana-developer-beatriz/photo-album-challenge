import { Router } from 'express';
import { signupController, loginController, getUsersController } from '../controllers/UserController';
import { getAlbumsByUserController } from '../controllers/AlbumController';

const router = Router();

//#Login e Cadastro
router.post('user/signup', signupController);
router.post('user/login', loginController);

//#Rotas
router.get('/users/:userId/albums', getAlbumsByUserController);
router.get('/listUsers', getUsersController);

export default router;
