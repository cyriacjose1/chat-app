import { Request, Response }
  from "express";

import {
  createMessage,
  getMessages,
} from "./message.service.js";

import {
  createMessageSchema,
} from "./message.validation.js";

import {
  markMessagesAsRead,
} from "./message.service.js";

import { getIO } from "../../socket/index.js";

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
        String(req.params.id),
        req.user!.userId
      );

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
  console.error(error);

  return res.status(500).json({
    success: false,
    message:
      error instanceof Error
        ? error.message
        : "Failed to fetch messages",
  });
}
}

export async function readMessages(
  req: any,
  res: any
) {
  try {
    const userId =
      req.user.userId;

    const {
      conversationId,
    } = req.body;

    const readMessages =
    await markMessagesAsRead(
    conversationId,
    userId
    );

    getIO().to(conversationId).emit(
    "messages_read",
    {
      messageIds:
        readMessages.map(
          (m) => m.id
        ),
    }
  );

    return res.json({
      success: true,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message:
        error.message,
    });
  }
}

