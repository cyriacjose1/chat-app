import { useState } from "react";
import { loginUser } from "../api/auth.api";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const setToken = useAuthStore(
  (state) => state.setToken
);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await loginUser({ email, password });

      console.log("Login success:", res);

      setToken(res.token);

      navigate("/dashboard");
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      alert("Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}