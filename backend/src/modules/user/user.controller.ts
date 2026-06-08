import { Request, Response } from "express";
import { getCurrentUser } from "./user.service.js";
import { getAllUsers } from "./user.service.js";

export async function getMe(
  req: Request,
  res: Response
) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await getCurrentUser(userId);

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch user",
    });
  }
}

export async function getUsers(
  _req: Request,
  res: Response
) {
  try {
    const users = await getAllUsers();

    return res.status(200).json({
      success: true,
      users,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
}