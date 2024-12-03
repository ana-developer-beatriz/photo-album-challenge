import { Router } from 'express';
import {
  createAlbumController,
  getAlbumsController,
  getAlbumByIdController,
  updateAlbumController,
  deleteAlbumController,
} from '../controllers/AlbumController';
import { authenticateToken } from '../middleware/authenticateToken';

const router = Router();

router.post('/createAlbum', authenticateToken, createAlbumController);
router.get('/getAlbums', getAlbumsController);
router.get('/getAlbumById/:id', getAlbumByIdController);
router.put('/updateAlbum/:id', authenticateToken, updateAlbumController);
router.delete('/deleteAlbum/:id', authenticateToken, deleteAlbumController);

export default router;
