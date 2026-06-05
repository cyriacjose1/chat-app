import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export default function Dashboard() {
  const logout = useAuthStore(
    (state) => state.logout
  );

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <h2>Dashboard</h2>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}