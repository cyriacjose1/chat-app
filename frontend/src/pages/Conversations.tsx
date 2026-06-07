import { useEffect, useState }
  from "react";

import { Link }
  from "react-router-dom";

import {
  getConversations,
} from "../api/conversation.api";

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
        (conversation) => (
          <div
            key={conversation.id}
          >
            <Link
              to={`/conversations/${conversation.id}`}
            >
              Open Conversation
            </Link>
          </div>
        )
      )}
    </div>
  );
}