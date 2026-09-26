import { useEffect, useState } from "react";
import api from "../../api/axiosInstance.js";

function ArticleValidation() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");

  const fetchPending = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/articles/pending");
      setArticles(res.data);
    } catch (err) {
      setError("Impossible de charger les articles en attente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPending(); }, []);

  const handleValidate = async (id) => {
    setActionMsg("");
    try {
      await api.patch(`/articles/${id}/validate`);
      setActionMsg("Article validé.");
      setArticles((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      setActionMsg(err.response?.data?.message || "Erreur lors de la validation.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Rejeter (supprimer) cet article ?")) return;
    setActionMsg("");
    try {
      await api.delete(`/articles/${id}`);
      setActionMsg("Article rejeté.");
      setArticles((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      setActionMsg(err.response?.data?.message || "Erreur lors du rejet.");
    }
  };

  if (loading) return <p className="text-stone-muted text-sm">Chargement...</p>;
  if (error) return <p className="text-red-600 text-sm">{error}</p>;

  return (
    <div>
      <p className="text-xs tracking-[0.2em] text-gold uppercase mb-2">Validation</p>
      <h1 className="font-serif text-3xl text-charcoal mb-8">Blog en attente</h1>

      {actionMsg && <p className="text-stone-muted text-sm mb-4">{actionMsg}</p>}
      {articles.length === 0 && <p className="text-stone-muted text-sm">Aucun article en attente.</p>}

      <div className="space-y-2">
        {articles.map((a) => (
          <div key={a._id} className="bg-white border border-stone-light rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-serif text-charcoal" dir={a.rtl ? "rtl" : "ltr"}>{a.titre}</p>
              <p className="text-xs text-stone-muted">Proposé par {a.contributeur?.nom || "inconnu"} ({a.contributeur?.email})</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => handleValidate(a._id)} className="px-4 py-2 bg-charcoal text-cream rounded-md text-xs hover:bg-indigo-blue transition-colors">
                Valider
              </button>
              <button onClick={() => handleDelete(a._id)} className="px-4 py-2 bg-red-600 text-white rounded-md text-xs hover:bg-red-700 transition-colors">
                Rejeter
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArticleValidation;