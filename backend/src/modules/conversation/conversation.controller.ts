import {
  Request,
  Response,
} from "express";

import {
  createConversation,
  getUserConversations,
} from "./conversation.service.js";

import {
  createConversationSchema,
} from "./conversation.validation.js";

export async function create(
  req: Request,
  res: Response
) {
  try {
    const data =
      createConversationSchema.parse(
        req.body
      );

    const conversation =
      await createConversation(
        req.user!.userId,
        data
      );

    return res.status(201).json({
      success: true,
      conversation,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create conversation",
    });
  }
}

export async function list(
  req: Request,
  res: Response
) {
  try {
    const conversations =
      await getUserConversations(
        req.user!.userId
      );

    return res.status(200).json({
      success: true,
      conversations,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch conversations",
    });
  }
}