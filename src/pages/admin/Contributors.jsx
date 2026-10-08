import { useEffect, useState } from "react";
import api from "../../api/axiosInstance.js";

const emptyForm = { nom: "", email: "", password: "" };

function Contributors() {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchContributors = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/auth/users");
      setContributors(res.data);
    } catch (err) {
      setError("Impossible de charger les contributeurs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContributors(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setActionMsg("");
    try {
      await api.post("/auth/users", form);
      setActionMsg("Contributeur ajouté.");
      setForm(emptyForm);
      fetchContributors();
    } catch (err) {
      setActionMsg(err.response?.data?.message || "Erreur lors de l'ajout.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce contributeur ?")) return;
    setActionMsg("");
    try {
      await api.delete(`/auth/users/${id}`);
      setActionMsg("Contributeur supprimé.");
      setContributors((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      setActionMsg(err.response?.data?.message || "Erreur lors de la suppression.");
    }
  };

  return (
    <div>
      <p className="text-xs tracking-[0.2em] text-gold uppercase mb-2">Équipe</p>
      <h1 className="font-serif text-3xl text-charcoal mb-8">Contributeurs</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-stone-light rounded-lg p-6 mb-8 space-y-3 max-w-md">
        <h2 className="font-serif text-lg text-charcoal mb-1">Ajouter un contributeur</h2>
        <input type="text" name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} required
          className="w-full px-4 py-2.5 border border-stone-light rounded-md text-sm focus:outline-none focus:border-indigo-blue" />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required
          className="w-full px-4 py-2.5 border border-stone-light rounded-md text-sm focus:outline-none focus:border-indigo-blue" />
        <input type="password" name="password" placeholder="Mot de passe temporaire (8 caractères minimum)" value={form.password} onChange={handleChange} minLength={8} required
          className="w-full px-4 py-2.5 border border-stone-light rounded-md text-sm focus:outline-none focus:border-indigo-blue" />
        {actionMsg && <p className="text-stone-muted text-xs">{actionMsg}</p>}
        <button type="submit" disabled={submitting}
          className="px-5 py-2.5 bg-charcoal text-cream rounded-md text-sm hover:bg-indigo-blue transition-colors disabled:opacity-50">
          {submitting ? "Ajout..." : "Ajouter"}
        </button>
      </form>

      {loading && <p className="text-stone-muted text-sm">Chargement...</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="space-y-2">
        {contributors.length === 0 && !loading && (
          <p className="text-stone-muted text-sm">Aucun contributeur pour l'instant.</p>
        )}
        {contributors.map((c) => (
          <div key={c._id} className="bg-white border border-stone-light rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-serif text-charcoal">{c.nom}</p>
              <p className="text-xs text-stone-muted">{c.email}</p>
            </div>
            <button onClick={() => handleDelete(c._id)} className="px-4 py-2 bg-red-600 text-white rounded-md text-xs hover:bg-red-700 transition-colors">
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Contributors;