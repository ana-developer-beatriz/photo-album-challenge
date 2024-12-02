import { Router } from "express";
import { signupController, loginController } from "../controllers/UserController";

const router = Router();

router.post("/signup", signupController);

router.post("/login", loginController);

export default router;
