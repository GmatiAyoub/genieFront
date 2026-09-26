import { useEffect, useState } from "react";
import api from "../../api/axiosInstance.js";

function BookValidation() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");

  const fetchPending = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/books/pending");
      setBooks(res.data);
    } catch (err) {
      setError("Impossible de charger les livres en attente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPending(); }, []);

  const handleValidate = async (id) => {
    setActionMsg("");
    try {
      await api.patch(`/books/${id}/validate`);
      setActionMsg("Livre validé.");
      setBooks((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      setActionMsg(err.response?.data?.message || "Erreur lors de la validation.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Rejeter (supprimer) ce livre ?")) return;
    setActionMsg("");
    try {
      await api.delete(`/books/${id}`);
      setActionMsg("Livre rejeté.");
      setBooks((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      setActionMsg(err.response?.data?.message || "Erreur lors du rejet.");
    }
  };

  if (loading) return <p className="text-stone-muted text-sm">Chargement...</p>;
  if (error) return <p className="text-red-600 text-sm">{error}</p>;

  return (
    <div>
      <p className="text-xs tracking-[0.2em] text-gold uppercase mb-2">Validation</p>
      <h1 className="font-serif text-3xl text-charcoal mb-8">Livres en attente</h1>

      {actionMsg && <p className="text-stone-muted text-sm mb-4">{actionMsg}</p>}
      {books.length === 0 && <p className="text-stone-muted text-sm">Aucun livre en attente.</p>}

      <div className="space-y-2">
        {books.map((b) => (
          <div key={b._id} className="bg-white border border-stone-light rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {b.image && <img src={`/uploads/books/${b.image}`} alt={b.titre} className="w-12 h-12 object-cover rounded" />}
              <div>
                <p className="font-serif text-charcoal">{b.titre} · <span className="text-gold text-sm">{b.prix} DT</span></p>
                <p className="text-xs text-stone-muted">Proposé par {b.contributeur?.nom || "inconnu"} ({b.contributeur?.email})</p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => handleValidate(b._id)} className="px-4 py-2 bg-charcoal text-cream rounded-md text-xs hover:bg-indigo-blue transition-colors">
                Valider
              </button>
              <button onClick={() => handleDelete(b._id)} className="px-4 py-2 bg-red-600 text-white rounded-md text-xs hover:bg-red-700 transition-colors">
                Rejeter
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookValidation;