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
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Bonjour {user?.nom} 👋</h1>
      <p className="text-slate-500 mb-6">Bienvenue sur votre espace Contributeur.</p>

      {loading && <p className="text-slate-500">Chargement des statistiques...</p>}

      {!loading && stats && (
        <>
          <div className="grid gap-4 sm:grid-cols-3 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-5">
              <p className="text-sm text-slate-500">Mes ressources</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{stats.myResourcesTotal}</p>
              <p className="text-xs text-slate-400 mt-1">
                {stats.myResourcesPending} en attente · {stats.myResourcesValidated} validées
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-5">
              <p className="text-sm text-slate-500">Mes livres</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{stats.myBooksTotal}</p>
              <p className="text-xs text-slate-400 mt-1">
                {stats.myBooksPending} en attente · {stats.myBooksValidated} validés
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-5">
                <p className="text-sm text-slate-500">Mes blogs</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{stats.myArticlesTotal}</p>
              <p className="text-xs text-slate-400 mt-1">
                {stats.myArticlesPending} en attente · {stats.myArticlesValidated} validés
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/contributeur/soumettre" className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 text-sm">
              Soumettre une ressource
            </Link>
            <Link to="/contributeur/soumettre-livre" className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 text-sm">
              Soumettre un livre
            </Link>
            <Link to="/contributeur/soumettre-article" className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 text-sm">
  Soumettre un article
</Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;