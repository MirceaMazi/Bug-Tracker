import { Router } from "express";
import { authController } from "../controllers/index.js";

const router = Router();

router.get("/current", authController.getCurrentUser);
router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/logout", authController.logout);

export default router;
