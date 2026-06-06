import {
  Request,
  Response,
} from "express";

import {
  createConversation,
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