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

  useEffect(() => { fetchArticles(); }, []);

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
      <p className="text-xs tracking-[0.2em] text-gold uppercase mb-2">Blog</p>
      <h1 className="font-serif text-3xl text-charcoal mb-8">Gestion du blog</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-stone-light rounded-lg p-6 mb-8 space-y-3 max-w-lg">
        <h2 className="font-serif text-lg text-charcoal mb-1">
          {editingId ? "Modifier l'article" : "Nouvel article"}
        </h2>
        <input
          type="text" name="titre" placeholder="Titre" value={form.titre} onChange={handleChange} required
          dir={form.rtl ? "rtl" : "ltr"}
          className="w-full px-4 py-2.5 border border-stone-light rounded-md text-sm focus:outline-none focus:border-indigo-blue"
        />
        <textarea
          name="contenu" placeholder="Contenu (écriture libre, même en mélangeant les langues)"
          value={form.contenu} onChange={handleChange} required rows={5}
          dir={form.rtl ? "rtl" : "ltr"}
          className="w-full px-4 py-2.5 border border-stone-light rounded-md text-sm focus:outline-none focus:border-indigo-blue"
        />
        <label className="flex items-center gap-2 text-xs text-stone-muted">
          <input type="checkbox" name="rtl" checked={form.rtl} onChange={handleChange} />
          Afficher de droite à gauche (texte majoritairement en arabe)
        </label>
        {actionMsg && <p className="text-stone-muted text-xs">{actionMsg}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={submitting}
            className="px-5 py-2.5 bg-charcoal text-cream rounded-md text-sm hover:bg-indigo-blue transition-colors disabled:opacity-50">
            {submitting ? "Enregistrement..." : editingId ? "Enregistrer" : "Publier"}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="px-5 py-2.5 border border-stone-light rounded-md text-sm hover:bg-cream transition-colors">
              Annuler
            </button>
          )}
        </div>
      </form>

      {loading && <p className="text-stone-muted text-sm">Chargement...</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="space-y-2">
        {articles.map((a) => (
          <div key={a._id} className="bg-white border border-stone-light rounded-lg p-4 flex items-center justify-between">
            <span className="font-serif text-charcoal" dir={a.rtl ? "rtl" : "ltr"}>{a.titre}</span>
            <div className="flex gap-2">
              <button onClick={() => startEdit(a)} className="px-4 py-2 border border-stone-light rounded-md text-xs hover:bg-cream transition-colors">
                Modifier
              </button>
              <button onClick={() => handleDelete(a._id)} className="px-4 py-2 bg-red-600 text-white rounded-md text-xs hover:bg-red-700 transition-colors">
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