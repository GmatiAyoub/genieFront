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

  useEffect(() => {
    fetchPending();
  }, []);

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

  if (loading) return <p className="text-slate-500">Chargement...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        Ressources en attente de validation
      </h1>

      {actionMsg && <p className="text-slate-600 mb-4">{actionMsg}</p>}

      {resources.length === 0 && <p className="text-slate-500">Aucune ressource en attente.</p>}

      <div className="space-y-3">
        {resources.map((r) => (
          <div key={r._id} className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-800">{r.titre}</p>
              <p className="text-sm text-slate-500">
                {r.type} — {r.matiere} — proposé par {r.contributeur?.nom || "inconnu"} ({r.contributeur?.email})
              </p>
              <a
                href={`/uploads/resources/${r.fichier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                Voir le fichier
              </a>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleValidate(r._id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                Valider
              </button>
              <button
                onClick={() => handleDelete(r._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
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