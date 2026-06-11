import { Router }
  from "express";

import {
  authenticate,
} from "../../middleware/auth.middleware.js";

import {
  create,
  list,
  readMessages,
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

router.post(
  "/read",
  authenticate,
  readMessages
);

export default router;