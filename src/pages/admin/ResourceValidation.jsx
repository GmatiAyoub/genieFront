import { useEffect, useState } from "react";
import api from "../../api/axiosInstance.js";

function ResourceValidation() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");

  const fetchPending = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/resources/pending");
      setResources(res.data);
    } catch (err) {
      setError("Impossible de charger les ressources en attente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPending(); }, []);

  const handleValidate = async (id) => {
    setActionMsg("");
    try {
      await api.patch(`/resources/${id}/validate`);
      setActionMsg("Ressource validée.");
      setResources((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setActionMsg(err.response?.data?.message || "Erreur lors de la validation.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer définitivement cette ressource ?")) return;
    setActionMsg("");
    try {
      await api.delete(`/resources/${id}`);
      setActionMsg("Ressource supprimée.");
      setResources((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setActionMsg(err.response?.data?.message || "Erreur lors de la suppression.");
    }
  };

  if (loading) return <p className="text-stone-muted text-sm">Chargement...</p>;
  if (error) return <p className="text-red-600 text-sm">{error}</p>;

  return (
    <div>
      <p className="text-xs tracking-[0.2em] text-gold uppercase mb-2">Validation</p>
      <h1 className="font-serif text-3xl text-charcoal mb-8">Ressources en attente</h1>

      {actionMsg && <p className="text-stone-muted text-sm mb-4">{actionMsg}</p>}
      {resources.length === 0 && <p className="text-stone-muted text-sm">Aucune ressource en attente.</p>}

      <div className="space-y-2">
        {resources.map((r) => (
          <div key={r._id} className="bg-white border border-stone-light rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-serif text-charcoal">{r.titre}</p>
              <p className="text-xs text-stone-muted">
                {r.type} · {r.matiere} · proposé par {r.contributeur?.nom || "inconnu"} ({r.contributeur?.email})
              </p>
              <a href={`/uploads/resources/${r.fichier}`} target="_blank" rel="noopener noreferrer"
                className="text-xs text-indigo-blue hover:underline">
                Voir le fichier
              </a>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => handleValidate(r._id)} className="px-4 py-2 bg-charcoal text-cream rounded-md text-xs hover:bg-indigo-blue transition-colors">
                Valider
              </button>
              <button onClick={() => handleDelete(r._id)} className="px-4 py-2 bg-red-600 text-white rounded-md text-xs hover:bg-red-700 transition-colors">
                Rejeter
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResourceValidation;