import { Router } from "express";

import {
  authenticate,
} from "../../middleware/auth.middleware.js";

import {
  create,
} from "./conversation.controller.js";

import {
  list,
} from "./conversation.controller.js";

const router = Router();

router.post(
  "/",
  authenticate,
  create
);

router.get(
  "/",
  authenticate,
  list
);

router.post("/", authenticate, create);

export default router;