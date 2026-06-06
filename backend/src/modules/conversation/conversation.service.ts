import { prisma } from "../../lib/prisma.js";
import type {
  CreateConversationInput,
} from "./conversation.validation.js";

export async function createConversation(
  currentUserId: string,
  data: CreateConversationInput
) {
  if (currentUserId === data.userId) {
    throw new Error(
      "Cannot create conversation with yourself"
    );
  }

  const targetUser =
    await prisma.user.findUnique({
      where: {
        id: data.userId,
      },
    });

  if (!targetUser) {
    throw new Error(
      "User not found"
    );
  }

  const conversation =
    await prisma.conversation.create({
      data: {
        participants: {
          create: [
            {
              userId: currentUserId,
            },
            {
              userId: data.userId,
            },
          ],
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });

  return conversation;
}