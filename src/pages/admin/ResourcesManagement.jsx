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

  useEffect(() => {
    fetchResources();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setActionMsg("Merci de choisir un fichier.");
      return;
    }
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
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Gestion des ressources</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-4 mb-6 space-y-3 max-w-md">
        <h2 className="font-bold text-slate-700">Ajouter une ressource</h2>
        <input
          type="text"
          name="titre"
          placeholder="Titre"
          value={form.titre}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-lg"
        />
        <input
          type="text"
          name="matiere"
          placeholder="Matière (ex: Maths)"
          value={form.matiere}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-lg"
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="Cours">Cours</option>
          <option value="Série">Série</option>
          <option value="Devoir">Devoir</option>
        </select>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files[0] || null)}
          required
          className="w-full text-sm"
        />

        {actionMsg && <p className="text-slate-600 text-sm">{actionMsg}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50"
        >
          {submitting ? "Envoi..." : "Ajouter"}
        </button>
      </form>

      {loading && <p className="text-slate-500">Chargement...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="space-y-3">
        {resources.map((r) => (
          <div key={r._id} className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-800">{r.titre}</p>
              <p className="text-sm text-slate-500">{r.type} — {r.matiere}</p>
            </div>
            <button
              onClick={() => handleDelete(r._id)}
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

export default ResourcesManagement;