import { Router } from 'express';
import {
  createPhotoController,
  getPhotosController,
  getPhotoByIdController,
  updatePhotoController,
  deletePhotoController,
  getPhotosByAlbumController,
} from '../controllers/PhotoController';
import { authenticateToken } from '../middleware/authenticateToken';

const router = Router();

router.get('/getPhotosByAlbum/:albumId/photos', getPhotosByAlbumController)


router.post('/createPhotos', authenticateToken, createPhotoController);
router.get('/getPhotos', getPhotosController);
router.get('/getPhotosById/:id', getPhotoByIdController);
router.put('/updatePhotos/:id', authenticateToken, updatePhotoController);
router.delete('/deletePhotos/:id', authenticateToken, deletePhotoController);

export default router;
