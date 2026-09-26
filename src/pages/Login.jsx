import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance.js";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data);
      navigate(res.data.role === "admin" ? "/admin" : "/contributeur");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10">
      <div className="text-center mb-8">
        <img src="/logo.png" alt="Le Génie" className="h-14 w-14 object-contain mx-auto mb-3" />
        <h1 className="font-serif text-2xl text-charcoal">Connexion</h1>
      </div>
      <form onSubmit={handleSubmit} className="bg-white border border-stone-light p-7 rounded-lg space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2.5 border border-stone-light rounded-md text-sm bg-white focus:outline-none focus:border-indigo-blue"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2.5 border border-stone-light rounded-md text-sm bg-white focus:outline-none focus:border-indigo-blue"
        />
        {error && <p className="text-red-600 text-xs">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 bg-charcoal text-cream rounded-md text-sm hover:bg-indigo-blue transition-colors disabled:opacity-50"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}

export default Login;