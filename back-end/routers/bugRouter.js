import { Router } from "express";
import { bugController } from "../controllers/index.js";

const router = Router();

router.get("/project/:projectId", bugController.getAllOfProject);
router.get("/:bugId", bugController.getById);
router.post("/project/:projectId", bugController.create);
router.put("/:bugId", bugController.update);
router.post("/:bugId", bugController.assign);
router.post("/:bugId/resolve", bugController.resolve);
router.delete("/:bugId", bugController.delete);

export default router;
