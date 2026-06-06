import { useEffect, useState } from "react";
import { getUsers } from "../api/user.api";

type User = {
  id: string;
  username: string;
  email: string;
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);

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

  return (
    <div>
      <h2>Users</h2>

      {users.map((user) => (
        <div key={user.id}>
          <p>{user.username}</p>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}