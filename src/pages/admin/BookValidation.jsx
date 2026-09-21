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

  if (loading) return <p className="text-slate-500">Chargement...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Livres en attente de validation</h1>
      {actionMsg && <p className="text-slate-600 mb-4">{actionMsg}</p>}
      {books.length === 0 && <p className="text-slate-500">Aucun livre en attente.</p>}
      <div className="space-y-3">
        {books.map((b) => (
          <div key={b._id} className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {b.image && <img src={`/uploads/books/${b.image}`} alt={b.titre} className="w-12 h-12 object-cover rounded" />}
              <div>
                <p className="font-bold text-slate-800">{b.titre} — {b.prix} DT</p>
                <p className="text-sm text-slate-500">Proposé par {b.contributeur?.nom || "inconnu"} ({b.contributeur?.email})</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleValidate(b._id)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">Valider</button>
              <button onClick={() => handleDelete(b._id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">Rejeter</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookValidation;