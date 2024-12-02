import { Router } from "express";
import userRoutes from "./userRoutes";
import photoRoutes from "./photoRoutes";
import albumRoutes from "./albumRoutes";
const router = Router();

router.use("/users", userRoutes);
router.use("/photo", photoRoutes)
router.use("/album", albumRoutes);
export default router;
