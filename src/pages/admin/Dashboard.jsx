import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../api/axiosInstance.js";

function StatCard({ label, value, to }) {
  return (
    <a
      href={to}
      className="bg-white border border-stone-light rounded-lg p-6 hover:border-gold transition-colors"
    >
      <p className="text-xs tracking-[0.1em] text-stone-faint uppercase mb-2">{label}</p>
      <p className="font-serif text-3xl text-charcoal">{value}</p>
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
      <p className="text-xs tracking-[0.2em] text-gold uppercase mb-2">Dashboard</p>
      <h1 className="font-serif text-3xl text-charcoal mb-1">Bonjour {user?.nom}</h1>
      <p className="text-stone-muted text-sm mb-8">Bienvenue sur votre espace Admin.</p>

      {loading && <p className="text-stone-muted text-sm">Chargement des statistiques...</p>}

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