import { prisma } from "../../lib/prisma.js";
import type {
  CreateMessageInput,
} from "./message.validation.js";

import {
  isParticipant,
} from "../conversation/conversation.service.js";

export async function createMessage(
  senderId: string,
  data: CreateMessageInput
) {
  const participant =
    await isParticipant(
      data.conversationId,
      senderId
    );

  if (!participant) {
    throw new Error(
      "Access denied"
    );
  }

  const message =
    await prisma.message.create({
      data: {
        content: data.content,
        senderId,
        conversationId:
          data.conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

  return message;
}

export async function getMessages(
  conversationId: string,
  userId: string
) {
  const participant =
    await isParticipant(
      conversationId,
      userId
    );

  if (!participant) {
    throw new Error(
      "Access denied"
    );
  }

  return prisma.message.findMany({
    where: {
      conversationId,
    },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}