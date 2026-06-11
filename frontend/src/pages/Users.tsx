import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getUsers } from "../api/user.api";
import { createConversation } from "../api/conversation.api";
import { useAuthStore } from "../store/auth.store";
import { usePresenceStore } from "../store/presence.store";

type User = {
  id: string;
  username: string;
  email: string;
};

export default function Users() {
  const [users, setUsers] =
    useState<User[]>([]);

  const navigate = useNavigate();

  const currentUser =
    useAuthStore(
      (state) => state.user
    );

  const onlineUsers =
  usePresenceStore(
    (state) =>
      state.onlineUsers
  );

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await getUsers();

        setUsers(res.users);
      } catch (error) {
        console.error(error);
      }
    }

    loadUsers();
  }, []);

  const handleStartChat = async (
    userId: string
  ) => {
    try {
      const res =
        await createConversation(
          userId
        );

      navigate(
        `/conversations/${res.conversation.id}`
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to create conversation"
      );
    }
  };

  return (
    <div>
      <h2>Users</h2>

      {users
        .filter(
          (user) =>
            user.id !== currentUser?.id
        )
        .map((user) => (
          <div key={user.id}>
            <p>
              {user.username}

              {" "}

              {onlineUsers.includes(
              user.id
              )
              ? "🟢 Online"
              : "⚫ Offline"}
            </p>

            <p>{user.email}</p>

            <button
              onClick={() =>
                handleStartChat(
                  user.id
                )
              }
            >
              Chat
            </button>
          </div>
        ))}
    </div>
  );
}