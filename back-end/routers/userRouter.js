import { Router } from "express";
import { userController } from "../controllers/index.js";

const router = Router();

router.get("/", userController.getAll);
router.get("/:userId", userController.getById);

export default router;
