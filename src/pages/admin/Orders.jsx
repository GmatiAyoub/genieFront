import { useEffect, useState } from "react";
import api from "../../api/axiosInstance.js";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");
  const [filter, setFilter] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (filter) params.statut = filter;
      const res = await api.get("/orders", { params });
      setOrders(res.data);
    } catch (err) {
      setError("Impossible de charger les commandes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleProcess = async (id) => {
    setActionMsg("");
    try {
      await api.patch(`/orders/${id}/process`);
      setActionMsg("Commande marquée comme traitée.");
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, statut: "Traité" } : o))
      );
    } catch (err) {
      setActionMsg(err.response?.data?.message || "Erreur lors du traitement.");
    }
  };

  if (loading) return <p className="text-slate-500">Chargement...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Commandes de livres</h1>

      <div className="flex gap-3 mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">Toutes</option>
          <option value="Nouveau">Nouveau</option>
          <option value="Traité">Traité</option>
        </select>
      </div>

      {actionMsg && <p className="text-slate-600 mb-4">{actionMsg}</p>}

      {orders.length === 0 && <p className="text-slate-500">Aucune commande.</p>}

      <div className="space-y-3">
        {orders.map((o) => (
          <div
            key={o._id}
            className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-bold text-slate-800">
                {o.livre?.titre} — {o.livre?.prix} DT
              </p>
              <p className="text-sm text-slate-500">
                Client : {o.nomClient} — Tél : {o.telephone} — Adresse : {o.adresse}
              </p>
              <span
                className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold ${
                  o.statut === "Nouveau"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {o.statut}
              </span>
            </div>
            {o.statut === "Nouveau" && (
              <button
                onClick={() => handleProcess(o._id)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 text-sm"
              >
                Marquer traitée
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;