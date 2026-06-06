import { prisma } from "../../lib/prisma.js";
import type {
  CreateMessageInput,
} from "./message.validation.js";

export async function createMessage(
  senderId: string,
  data: CreateMessageInput
) {
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
  conversationId: string
) {
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