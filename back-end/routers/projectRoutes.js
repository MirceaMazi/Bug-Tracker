import { Router } from "express";
import { projectController } from "../controllers/index.js";

const router = Router();

router.get("/", projectController.getAll);
router.get("/:projectId", projectController.getById);
router.post("/", projectController.create);
router.put("/:projectId", projectController.update);
router.post("/:projectId/adhere", projectController.adhereTester);
router.delete("/:projectId", projectController.delete);

export default router;
