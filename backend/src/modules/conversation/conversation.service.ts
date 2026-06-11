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
  const conversations =
  await prisma.conversation.findMany({
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

      /* FIX: We change 'include' to 'select' for messages so we can explicitly 
        choose scalar fields (senderId, isRead) alongside the sender relation.
      */
      messages: {
        take: 1,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,        // Include message ID if needed
          content: true,   // Include message content text if needed
          createdAt: true, // Include creation timestamp if needed
          senderId: true,  // <--- Valid inside a select block!
          isRead: true,    // <--- Valid inside a select block!
          sender: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
    },

    orderBy: {
      updatedAt: "desc",
    },
  });

  const withUnreadCounts =
    await Promise.all(
      conversations.map(
        async (conversation) => {
          const unreadCount =
            await prisma.message.count({
              where: {
                conversationId:
                  conversation.id,

                senderId: {
                  not: userId,
                },

                isRead: false,
              },
            });

          return {
            ...conversation,
            unreadCount,
          };
        }
      )
    );

  return withUnreadCounts;
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