import { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import { useAuthStore } from "./store/auth.store";
import { getCurrentUser } from "./api/user.api";

function App() {
  const token = useAuthStore(
    (state) => state.token
  );

  const setUser = useAuthStore(
    (state) => state.setUser
  );

  useEffect(() => {
    const restoreSession = async () => {
      if (!token) return;

      try {
        const res =
          await getCurrentUser();

        setUser(res.user);
      } catch {
        console.error(
          "Failed to restore session"
        );
      }
    };

    restoreSession();
  }, [token, setUser]);

  return <AppRouter />;
}

export default App;