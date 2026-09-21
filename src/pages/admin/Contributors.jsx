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

  useEffect(() => {
    fetchContributors();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Gestion des contributeurs</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-sm p-4 mb-6 space-y-3 max-w-md"
      >
        <h2 className="font-bold text-slate-700">Ajouter un contributeur</h2>
        <input
          type="text"
          name="nom"
          placeholder="Nom"
          value={form.nom}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-lg"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-lg"
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe temporaire"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-lg"
        />

        {actionMsg && <p className="text-slate-600 text-sm">{actionMsg}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50"
        >
          {submitting ? "Ajout..." : "Ajouter"}
        </button>
      </form>

      {loading && <p className="text-slate-500">Chargement...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="space-y-3">
        {contributors.length === 0 && !loading && (
          <p className="text-slate-500">Aucun contributeur pour l'instant.</p>
        )}
        {contributors.map((c) => (
          <div
            key={c._id}
            className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-bold text-slate-800">{c.nom}</p>
              <p className="text-sm text-slate-500">{c.email}</p>
            </div>
            <button
              onClick={() => handleDelete(c._id)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Contributors;