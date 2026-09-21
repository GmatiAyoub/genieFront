import { useEffect, useState } from "react";
import api from "../../api/axiosInstance.js";

function MyBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/books/mine")
      .then((res) => setBooks(res.data))
      .catch(() => setError("Impossible de charger vos livres."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate-500">Chargement...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Mes livres soumis</h1>
      {books.length === 0 && <p className="text-slate-500">Vous n'avez encore soumis aucun livre.</p>}
      <div className="space-y-3">
        {books.map((b) => (
          <div key={b._id} className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-800">{b.titre}</p>
              <p className="text-sm text-slate-500">{b.prix} DT</p>
            </div>
            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${b.statut === "En attente" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
              {b.statut}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBooks;