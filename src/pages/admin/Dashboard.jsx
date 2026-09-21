import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../api/axiosInstance.js";

function StatCard({ label, value, to }) {
  return (
    <a href={to} className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
    </a>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [pendingRes, pendingBooks, pendingArticles, ordersRes, contributorsRes, booksRes] =
          await Promise.all([
            api.get("/resources/pending"),
            api.get("/books/pending"),
            api.get("/articles/pending"),
            api.get("/orders", { params: { statut: "Nouveau" } }),
            api.get("/auth/users"),
            api.get("/books"),
          ]);
        setStats({
          pendingResources: pendingRes.data.length,
          pendingBooks: pendingBooks.data.length,
          pendingArticles: pendingArticles.data.length,
          newOrders: ordersRes.data.length,
          contributors: contributorsRes.data.length,
          books: booksRes.data.length,
        });
      } catch (err) {
        // silencieux
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Bonjour {user?.nom} 👋</h1>
      <p className="text-slate-500 mb-6">Bienvenue sur votre espace Admin.</p>

      {loading && <p className="text-slate-500">Chargement des statistiques...</p>}

      {!loading && stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Ressources en attente" value={stats.pendingResources} to="/admin/ressources" />
          <StatCard label="Livres en attente" value={stats.pendingBooks} to="/admin/validation-livres" />
          <StatCard label="Articles en attente" value={stats.pendingArticles} to="/admin/validation-blog" />
          <StatCard label="Commandes nouvelles" value={stats.newOrders} to="/admin/commandes" />
          <StatCard label="Contributeurs" value={stats.contributors} to="/admin/contributeurs" />
          <StatCard label="Livres au catalogue" value={stats.books} to="/admin/livres" />
        </div>
      )}
    </div>
  );
}

export default Dashboard;