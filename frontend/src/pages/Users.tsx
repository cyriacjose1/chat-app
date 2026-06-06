import { useEffect, useState } from "react";
import { getUsers } from "../api/user.api";
import { createConversation } from "../api/conversation.api";
import { useNavigate } from "react-router-dom";

type User = {
  id: string;
  username: string;
  email: string;
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);

  const navigate = useNavigate();

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
        await createConversation(userId);

      navigate(
        `/conversations/${res.conversation.id}`
      );
    } catch (error) {
      console.error(error);
      alert("Failed to create conversation");
    }
  };

  return (
    <div>
      <h2>Users</h2>

      {users.map((user) => (
        <div key={user.id}>
          <p>{user.username}</p>

          <p>{user.email}</p>

          <button
            onClick={() =>
              handleStartChat(user.id)
            }
          >
            Chat
          </button>
        </div>
      ))}
    </div>
  );
}