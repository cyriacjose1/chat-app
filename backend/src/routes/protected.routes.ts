import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/profile",
  authenticate,
  (req, res) => {
    return res.json({
      success: true,
      user: req.user,
    });
  }
);

export default router;