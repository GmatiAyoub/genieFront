import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../api/axiosInstance.js";

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const countByStatut = (arr, statut) => arr.filter((x) => x.statut === statut).length;

    const fetchStats = async () => {
      try {
        const [myResources, myBooks, myArticles] = await Promise.all([
          api.get("/resources/mine"),
          api.get("/books/mine"),
          api.get("/articles/mine"),
        ]);
        setStats({
          myResourcesTotal: myResources.data.length,
          myResourcesPending: countByStatut(myResources.data, "En attente"),
          myResourcesValidated: countByStatut(myResources.data, "Validé"),
          myBooksTotal: myBooks.data.length,
          myBooksPending: countByStatut(myBooks.data, "En attente"),
          myBooksValidated: countByStatut(myBooks.data, "Validé"),
          myArticlesTotal: myArticles.data.length,
          myArticlesPending: countByStatut(myArticles.data, "En attente"),
          myArticlesValidated: countByStatut(myArticles.data, "Validé"),
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
      <p className="text-stone-muted text-sm mb-8">Bienvenue sur votre espace Contributeur.</p>

      {loading && <p className="text-stone-muted text-sm">Chargement des statistiques...</p>}

      {!loading && stats && (
        <>
          <div className="grid gap-4 sm:grid-cols-3 mb-8">
            <div className="bg-white border border-stone-light rounded-lg p-6">
              <p className="text-xs tracking-[0.1em] text-stone-faint uppercase mb-2">Mes ressources</p>
              <p className="font-serif text-3xl text-charcoal">{stats.myResourcesTotal}</p>
              <p className="text-xs text-stone-muted mt-2">
                {stats.myResourcesPending} en attente · {stats.myResourcesValidated} validées
              </p>
            </div>
            <div className="bg-white border border-stone-light rounded-lg p-6">
              <p className="text-xs tracking-[0.1em] text-stone-faint uppercase mb-2">Mes livres</p>
              <p className="font-serif text-3xl text-charcoal">{stats.myBooksTotal}</p>
              <p className="text-xs text-stone-muted mt-2">
                {stats.myBooksPending} en attente · {stats.myBooksValidated} validés
              </p>
            </div>
            <div className="bg-white border border-stone-light rounded-lg p-6">
              <p className="text-xs tracking-[0.1em] text-stone-faint uppercase mb-2">Mes blogs</p>
              <p className="font-serif text-3xl text-charcoal">{stats.myArticlesTotal}</p>
              <p className="text-xs text-stone-muted mt-2">
                {stats.myArticlesPending} en attente · {stats.myArticlesValidated} validés
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/contributeur/soumettre" className="px-5 py-2.5 bg-charcoal text-cream rounded-md text-sm hover:bg-indigo-blue transition-colors">
              Soumettre une ressource
            </Link>
            <Link to="/contributeur/soumettre-livre" className="px-5 py-2.5 bg-charcoal text-cream rounded-md text-sm hover:bg-indigo-blue transition-colors">
              Soumettre un livre
            </Link>
            <Link to="/contributeur/soumettre-article" className="px-5 py-2.5 bg-charcoal text-cream rounded-md text-sm hover:bg-indigo-blue transition-colors">
              Soumettre un blog
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;