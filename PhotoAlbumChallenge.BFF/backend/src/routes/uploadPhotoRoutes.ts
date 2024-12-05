import { Router } from 'express';
import { upload } from '../middleware/s3Upload';
import  {uploadPhotoController} from '../controllers/UploadPhotoController';

const router = Router();


router.post('/upload', upload.single('photo'), uploadPhotoController);

export default router;
