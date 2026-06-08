import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getConversations } from "../api/conversation.api";
import { useAuthStore } from "../store/auth.store";

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
};

export default function Conversations() {
  const user = useAuthStore(
    (state) => state.user
  );

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

          return (
            <div
              key={conversation.id}
            >
              <Link
                to={`/conversations/${conversation.id}`}
              >
                {
                  otherParticipant?.user
                    .username ??
                  "Unknown User"
                }
              </Link>
            </div>
          );
        }
      )}
    </div>
  );
}