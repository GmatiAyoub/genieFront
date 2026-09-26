import { useEffect, useState } from "react";
import api from "../../api/axiosInstance.js";

function MyResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/resources/mine")
      .then((res) => setResources(res.data))
      .catch(() => setError("Impossible de charger vos ressources."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-stone-muted text-sm">Chargement...</p>;
  if (error) return <p className="text-red-600 text-sm">{error}</p>;

  return (
    <div>
      <p className="text-xs tracking-[0.2em] text-gold uppercase mb-2">Ressources</p>
      <h1 className="font-serif text-3xl text-charcoal mb-8">Mes ressources soumises</h1>

      {resources.length === 0 && <p className="text-stone-muted text-sm">Vous n'avez encore soumis aucune ressource.</p>}

      <div className="space-y-2">
        {resources.map((r) => (
          <div key={r._id} className="bg-white border border-stone-light rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-serif text-charcoal">{r.titre}</p>
              <p className="text-xs text-stone-muted">{r.type} · {r.matiere}</p>
            </div>
            <span className={`px-2.5 py-0.5 rounded text-[10px] tracking-wide uppercase font-medium ${
              r.statut === "En attente" ? "bg-gold/15 text-gold" : "bg-indigo-blue/10 text-indigo-blue"
            }`}>
              {r.statut}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyResources;