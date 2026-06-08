import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const logout = useAuthStore(
    (state) => state.logout
  );

  const user = useAuthStore(
    (state) => state.user
  );

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <h2>Dashboard</h2>

      <p>Welcome, {user?.username}!</p>

      <div>
        <Link to="/users">
          Users
        </Link>
      </div>

      <div>
        <Link to="/conversations">
          Conversations
        </Link>
      </div>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}