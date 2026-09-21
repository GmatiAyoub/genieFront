import { useEffect, useState } from "react";
import api from "../../api/axiosInstance.js";

function MyArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/articles/mine")
      .then((res) => setArticles(res.data))
      .catch(() => setError("Impossible de charger vos articles."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate-500">Chargement...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Mes blogs soumis</h1>
      {articles.length === 0 && <p className="text-slate-500">Vous n'avez encore soumis aucun blog.</p>}
      <div className="space-y-3">
        {articles.map((a) => (
          <div key={a._id} className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
            <p className="font-bold text-slate-800" dir={a.rtl ? "rtl" : "ltr"}>{a.titre}</p>
            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${a.statut === "En attente" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
              {a.statut}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyArticles;