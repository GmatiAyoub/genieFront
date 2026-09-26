import { useEffect, useState } from "react";
import api from "../../api/axiosInstance.js";

const emptyForm = { titre: "", matiere: "", type: "Cours" };

function ResourcesManagement() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchResources = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/resources");
      setResources(res.data);
    } catch (err) {
      setError("Impossible de charger les ressources.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResources(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setActionMsg("Merci de choisir un fichier."); return; }
    setSubmitting(true);
    setActionMsg("");
    try {
      const fd = new FormData();
      fd.append("titre", form.titre);
      fd.append("matiere", form.matiere);
      fd.append("type", form.type);
      fd.append("fichier", file);
      await api.post("/resources", fd);
      setActionMsg("Ressource ajoutée.");
      setForm(emptyForm);
      setFile(null);
      fetchResources();
    } catch (err) {
      setActionMsg(err.response?.data?.message || "Erreur lors de l'ajout.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette ressource ?")) return;
    setActionMsg("");
    try {
      await api.delete(`/resources/${id}`);
      setActionMsg("Ressource supprimée.");
      setResources((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setActionMsg(err.response?.data?.message || "Erreur lors de la suppression.");
    }
  };

  return (
    <div>
      <p className="text-xs tracking-[0.2em] text-gold uppercase mb-2">Ressources</p>
      <h1 className="font-serif text-3xl text-charcoal mb-8">Gestion des ressources</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-stone-light rounded-lg p-6 mb-8 space-y-3 max-w-md">
        <h2 className="font-serif text-lg text-charcoal mb-1">Ajouter une ressource</h2>
        <input type="text" name="titre" placeholder="Titre" value={form.titre} onChange={handleChange} required
          className="w-full px-4 py-2.5 border border-stone-light rounded-md text-sm focus:outline-none focus:border-indigo-blue" />
        <input type="text" name="matiere" placeholder="Matière (ex: Maths)" value={form.matiere} onChange={handleChange} required
          className="w-full px-4 py-2.5 border border-stone-light rounded-md text-sm focus:outline-none focus:border-indigo-blue" />
        <select name="type" value={form.type} onChange={handleChange}
          className="w-full px-4 py-2.5 border border-stone-light rounded-md text-sm focus:outline-none focus:border-indigo-blue">
          <option value="Cours">Cours</option>
          <option value="Série">Série</option>
          <option value="Devoir">Devoir</option>
        </select>
        <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files[0] || null)} required className="w-full text-sm" />
        {actionMsg && <p className="text-stone-muted text-xs">{actionMsg}</p>}
        <button type="submit" disabled={submitting}
          className="px-5 py-2.5 bg-charcoal text-cream rounded-md text-sm hover:bg-indigo-blue transition-colors disabled:opacity-50">
          {submitting ? "Envoi..." : "Ajouter"}
        </button>
      </form>

      {loading && <p className="text-stone-muted text-sm">Chargement...</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="space-y-2">
        {resources.map((r) => (
          <div key={r._id} className="bg-white border border-stone-light rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-serif text-charcoal">{r.titre}</p>
              <p className="text-xs text-stone-muted">{r.type} · {r.matiere}</p>
            </div>
            <button onClick={() => handleDelete(r._id)} className="px-4 py-2 bg-red-600 text-white rounded-md text-xs hover:bg-red-700 transition-colors">
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResourcesManagement;