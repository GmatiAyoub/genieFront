import { useEffect, useState } from "react";
import api from "../../api/axiosInstance.js";

function MyArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/articles/mine")
      .then((res) => setArticles(res.data))
      .catch(() => setError("Impossible de charger vos blogs."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-stone-muted text-sm">Chargement...</p>;
  if (error) return <p className="text-red-600 text-sm">{error}</p>;

  return (
    <div>
      <p className="text-xs tracking-[0.2em] text-gold uppercase mb-2">Blog</p>
      <h1 className="font-serif text-3xl text-charcoal mb-8">Mes blogs soumis</h1>

      {articles.length === 0 && <p className="text-stone-muted text-sm">Vous n'avez encore soumis aucun blog.</p>}

      <div className="space-y-2">
        {articles.map((a) => (
          <div key={a._id} className="bg-white border border-stone-light rounded-lg p-4 flex items-center justify-between">
            <p className="font-serif text-charcoal" dir={a.rtl ? "rtl" : "ltr"}>{a.titre}</p>
            <span className={`px-2.5 py-0.5 rounded text-[10px] tracking-wide uppercase font-medium ${
              a.statut === "En attente" ? "bg-gold/15 text-gold" : "bg-indigo-blue/10 text-indigo-blue"
            }`}>
              {a.statut}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyArticles;