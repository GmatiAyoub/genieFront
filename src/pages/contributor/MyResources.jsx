import { useEffect, useState } from "react";
import api from "../../api/axiosInstance.js";

function MyResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/resources/mine")
      .then((res) => setResources(res.data))
      .catch(() => setError("Impossible de charger vos ressources."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate-500">Chargement...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Mes ressources soumises</h1>

      {resources.length === 0 && (
        <p className="text-slate-500">Vous n'avez encore soumis aucune ressource.</p>
      )}

      <div className="space-y-3">
        {resources.map((r) => (
          <div
            key={r._id}
            className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-bold text-slate-800">{r.titre}</p>
              <p className="text-sm text-slate-500">{r.type} — {r.matiere}</p>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-xs font-semibold ${
                r.statut === "En attente"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {r.statut}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyResources;