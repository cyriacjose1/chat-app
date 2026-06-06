import { Request, Response }
  from "express";

import {
  createMessage,
  getMessages,
} from "./message.service.js";

import {
  createMessageSchema,
} from "./message.validation.js";

export async function create(
  req: Request,
  res: Response
) {
  try {
    const data =
      createMessageSchema.parse(
        req.body
      );

    const message =
      await createMessage(
        req.user!.userId,
        data
      );

    return res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to send message",
    });
  }
}

export async function list(
  req: Request,
  res: Response
) {
  try {
    const messages =
      await getMessages(
        String(req.params.id)
      );

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch messages",
    });
  }
}