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
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, statut: "Traité" } : o)));
    } catch (err) {
      setActionMsg(err.response?.data?.message || "Erreur lors du traitement.");
    }
  };

  const handleTogglePayment = async (id) => {
    setActionMsg("");
    try {
      const res = await api.patch(`/orders/${id}/payment`);
      setActionMsg(res.data.message);
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, paiement: res.data.order.paiement } : o)));
    } catch (err) {
      setActionMsg(err.response?.data?.message || "Erreur lors de la mise à jour du paiement.");
    }
  };

  if (loading) return <p className="text-stone-muted text-sm">Chargement...</p>;
  if (error) return <p className="text-red-600 text-sm">{error}</p>;

  return (
    <div>
      <p className="text-xs tracking-[0.2em] text-gold uppercase mb-2">Ventes</p>
      <h1 className="font-serif text-3xl text-charcoal mb-8">Commandes de livres</h1>

      <div className="mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 border border-stone-light rounded-md text-sm focus:outline-none focus:border-indigo-blue"
        >
          <option value="">Toutes</option>
          <option value="Nouveau">Nouveau</option>
          <option value="Traité">Traité</option>
        </select>
      </div>

      {actionMsg && <p className="text-stone-muted text-sm mb-4">{actionMsg}</p>}
      {orders.length === 0 && <p className="text-stone-muted text-sm">Aucune commande.</p>}

      <div className="space-y-2">
        {orders.map((o) => (
          <div key={o._id} className="bg-white border border-stone-light rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-serif text-charcoal">
                {o.livre?.titre} · <span className="text-gold text-sm">{o.livre?.prix} DT</span>
              </p>
              <p className="text-xs text-stone-muted">
                Client : {o.nomClient} · Tél : {o.telephone} · Adresse : {o.adresse}
              </p>
              <div className="flex gap-2 mt-2">
                <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] tracking-wide uppercase font-medium ${
                  o.statut === "Nouveau" ? "bg-gold/15 text-gold" : "bg-indigo-blue/10 text-indigo-blue"
                }`}>
                  {o.statut}
                </span>
                {o.statut === "Traité" && (
                  <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] tracking-wide uppercase font-medium ${
                    o.paiement === "Payé" ? "bg-indigo-blue/10 text-indigo-blue" : "bg-red-100 text-red-700"
                  }`}>
                    {o.paiement}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              {o.statut === "Nouveau" && (
                <button onClick={() => handleProcess(o._id)} className="px-4 py-2 bg-charcoal text-cream rounded-md text-xs hover:bg-indigo-blue transition-colors">
                  Marquer traitée
                </button>
              )}
              {o.statut === "Traité" && (
                <button
                  onClick={() => handleTogglePayment(o._id)}
                  className={`px-4 py-2 rounded-md text-xs text-white transition-colors ${
                    o.paiement === "Payé" ? "bg-red-600 hover:bg-red-700" : "bg-indigo-blue hover:bg-indigo-deep"
                  }`}
                >
                  {o.paiement === "Payé" ? "Marquer non payée" : "Marquer payée"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;