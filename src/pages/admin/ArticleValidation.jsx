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

  if (loading) return <p className="text-slate-500">Chargement...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Articles en attente de validation</h1>
      {actionMsg && <p className="text-slate-600 mb-4">{actionMsg}</p>}
      {articles.length === 0 && <p className="text-slate-500">Aucun article en attente.</p>}
      <div className="space-y-3">
        {articles.map((a) => (
          <div key={a._id} className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-800" dir={a.rtl ? "rtl" : "ltr"}>{a.titre}</p>
              <p className="text-sm text-slate-500">Proposé par {a.contributeur?.nom || "inconnu"} ({a.contributeur?.email})</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleValidate(a._id)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">Valider</button>
              <button onClick={() => handleDelete(a._id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">Rejeter</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArticleValidation;