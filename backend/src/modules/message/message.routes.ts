import { Router }
  from "express";

import {
  authenticate,
} from "../../middleware/auth.middleware.js";

import {
  create,
  list,
} from "./message.controller.js";

const router = Router();

router.post(
  "/",
  authenticate,
  create
);

router.get(
  "/conversation/:id",
  authenticate,
  list
);

export default router;