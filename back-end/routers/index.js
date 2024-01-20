import { Router } from "express";
import authRouter from "./authRouter.js";
import userRouter from "./userRouter.js";
import projectRouter from "./projectRoutes.js";
import bugRouter from "./bugRouter.js";

import { assertAccess } from "../helpers/authHelpers.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", assertAccess, userRouter);
router.use("/project", assertAccess, projectRouter);
router.use("/bug", assertAccess, bugRouter);

export default router;
