import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { getMe } from "./user.controller.js";
import { getUsers } from "./user.controller.js";

const router = Router();

router.get(
  "/me",
  authenticate,
  getMe
);

router.get(
  "/",
  authenticate,
  getUsers
);

export default router;