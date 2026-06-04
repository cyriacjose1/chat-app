import { Request, Response } from "express";
import { registerUser } from "./auth.service.js";
import { registerSchema } from "./auth.validation.js";

export async function register(
  req: Request,
  res: Response
) {
  try {
    const data = registerSchema.parse(req.body);

    const user = await registerUser(data);

    return res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Registration failed",
    });
  }
}