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
    throw new Error("User not found");
  }

  const existingConversations =
    await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: currentUserId,
          },
        },
      },
      include: {
        participants: true,
      },
    });

  const existingConversation =
    existingConversations.find(
      (conversation) => {
        const participantIds =
          conversation.participants.map(
            (participant) =>
              participant.userId
          );

        return (
          participantIds.length === 2 &&
          participantIds.includes(
            currentUserId
          ) &&
          participantIds.includes(
            data.userId
          )
        );
      }
    );

  if (existingConversation) {
    return existingConversation;
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

export async function getUserConversations(
  userId: string
) {
  return prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          userId,
        },
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
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export async function isParticipant(
  conversationId: string,
  userId: string
) {
  const participant =
    await prisma.conversationParticipant.findFirst({
      where: {
        conversationId,
        userId,
      },
    });

  return !!participant;
}