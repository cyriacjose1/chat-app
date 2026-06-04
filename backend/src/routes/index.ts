import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import protectedRoutes from "./protected.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/protected", protectedRoutes);

export default router;