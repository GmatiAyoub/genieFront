import { useEffect, useState } from "react";
import api from "../../api/axiosInstance.js";

const emptyForm = { titre: "", contenu: "", rtl: false };

function BlogManagement() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchArticles = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/articles");
      setArticles(res.data);
    } catch (err) {
      setError("Impossible de charger les articles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const startEdit = (article) => {
    setEditingId(article._id);
    setForm({ titre: article.titre, contenu: article.contenu, rtl: article.rtl });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setActionMsg("");
    try {
      if (editingId) {
        await api.patch(`/articles/${editingId}`, form);
        setActionMsg("Article modifié.");
      } else {
        await api.post("/articles", form);
        setActionMsg("Article publié.");
      }
      cancelEdit();
      fetchArticles();
    } catch (err) {
      setActionMsg(err.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet article ?")) return;
    setActionMsg("");
    try {
      await api.delete(`/articles/${id}`);
      setActionMsg("Article supprimé.");
      setArticles((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      setActionMsg(err.response?.data?.message || "Erreur lors de la suppression.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Gestion du blog</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-sm p-4 mb-6 space-y-3 max-w-lg"
      >
        <h2 className="font-bold text-slate-700">
          {editingId ? "Modifier l'article" : "Nouvel article"}
        </h2>

        <input
          type="text"
          name="titre"
          placeholder="Titre"
          value={form.titre}
          onChange={handleChange}
          required
          dir={form.rtl ? "rtl" : "ltr"}
          className="w-full px-3 py-2 border rounded-lg"
        />
        <textarea
          name="contenu"
          placeholder="Contenu (tu peux écrire librement, même en mélangeant les langues)"
          value={form.contenu}
          onChange={handleChange}
          required
          rows={5}
          dir={form.rtl ? "rtl" : "ltr"}
          className="w-full px-3 py-2 border rounded-lg"
        />

        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" name="rtl" checked={form.rtl} onChange={handleChange} />
          Afficher de droite à gauche (texte majoritairement en arabe)
        </label>

        {actionMsg && <p className="text-slate-600 text-sm">{actionMsg}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50"
          >
            {submitting ? "Enregistrement..." : editingId ? "Enregistrer" : "Publier"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2 border rounded-lg hover:bg-slate-100"
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      {loading && <p className="text-slate-500">Chargement...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="space-y-3">
        {articles.map((a) => (
          <div key={a._id} className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
            <span className="font-bold text-slate-800" dir={a.rtl ? "rtl" : "ltr"}>
              {a.titre}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(a)}
                className="px-4 py-2 border rounded-lg hover:bg-slate-100 text-sm"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(a._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogManagement;