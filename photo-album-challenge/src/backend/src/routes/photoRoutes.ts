import { Router } from "express";
import {
  createPhotoController,
  getPhotosController,
  getPhotoByIdController,
  updatePhotoController,
  deletePhotoController,
} from "../controllers/PhotoController";
import { authenticateToken } from "../middleware/authenticateToken";

const router = Router();

router.post("/createPhotos", authenticateToken, createPhotoController);
router.get("/getPhotos", getPhotosController);
router.get("/getPhotosById/:id", getPhotoByIdController);
router.put("/updatePhotos/:id", authenticateToken, updatePhotoController);
router.delete("/deletePhotos/:id", authenticateToken, deletePhotoController);

export default router;
