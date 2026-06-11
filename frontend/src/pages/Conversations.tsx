import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getConversations } from "../api/conversation.api";
import { useAuthStore } from "../store/auth.store";

import { usePresenceStore } from "../store/presence.store";

import { formatConversationTime } from "../utils/date";

type Participant = {
  user: {
    id: string;
    username: string;
    email: string;
  };
};

type Conversation = {
  id: string;

  participants: Participant[];

  messages: {
  content: string;
  createdAt: string;

  sender: {
    id: string;
    username: string;
  };
}[];
};

export default function Conversations() {
  const user = useAuthStore(
    (state) => state.user
  );

  const onlineUsers =usePresenceStore((state) => state.onlineUsers);

  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res =
          await getConversations();

        setConversations(
          res.conversations
        );
      } catch (error) {
        console.error(error);
      }
    }

    load();
  }, []);

  return (
    <div>
      <h2>Conversations</h2>

      {conversations.map(
  (conversation) => {
    const otherParticipant =
      conversation.participants.find(
        (participant) =>
          participant.user.id !==
          user?.id
      );

    const latestMessage =
      conversation.messages[0];

    const previewText =
  latestMessage
    ? latestMessage.sender.id ===
      user?.id
      ? `You: ${latestMessage.content}`
      : `${latestMessage.sender.username}: ${latestMessage.content}`
    : "No messages yet";

    return (
      <div key={conversation.id}>
        <Link
          to={`/conversations/${conversation.id}`}
        >
          <div>
            {onlineUsers.includes(
              otherParticipant?.user.id ?? ""
            )
              ? "🟢 "
              : "⚫ "}

            {
              otherParticipant?.user
                .username ??
              "Unknown User"
            }
          </div>

          <small>
          {previewText.length > 40
          ? previewText.slice(0, 40) + "..."
          : previewText}
          </small>

          {latestMessage && (
  <div>
    <small>
      {formatConversationTime(
        latestMessage.createdAt
      )}
    </small>
  </div>
)}
        </Link>
      </div>
    );
  }
)}
    </div>
  );
}