import { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import { useAuthStore } from "./store/auth.store";
import { getCurrentUser } from "./api/user.api";
import { socket } from "./socket";
import { usePresenceStore } from "./store/presence.store";

function App() {
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);
  const setOnlineUsers =usePresenceStore((state) => state.setOnlineUsers);

  useEffect(() => {
    const restoreSession = async () => {
      if (!token) return;

      try {
        const res = await getCurrentUser();
        setUser(res.user);
      } catch {
        console.error("Failed to restore session");
      }
    };

    restoreSession();
  }, [token, setUser]);

  useEffect(() => {
    if (!token) return;

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [token]);

  useEffect(() => {
    if (!user) return;

    socket.emit("register_user", user.id);
  }, [user]);

  useEffect(() => {
  socket.on(
    "online_users",
    (users: string[]) => {
      setOnlineUsers(
        users
      );
    }
  );

  return () => {
    socket.off(
      "online_users"
    );
  };
}, [setOnlineUsers]);

  return <AppRouter />;
}

export default App;