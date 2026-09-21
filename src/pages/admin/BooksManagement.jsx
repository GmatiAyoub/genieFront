import { useEffect, useState } from "react";
import api from "../../api/axiosInstance.js";

const emptyForm = { titre: "", prix: "", description: "" };

function BooksManagement() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");

  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [currentImage, setCurrentImage] = useState(""); // image existante en mode édition
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchBooks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/books");
      setBooks(res.data);
    } catch (err) {
      setError("Impossible de charger le catalogue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0] || null);
  };

  const startEdit = (book) => {
    setEditingId(book._id);
    setForm({
      titre: book.titre,
      prix: book.prix,
      description: book.description || "",
    });
    setCurrentImage(book.image || "");
    setImageFile(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setCurrentImage("");
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  setActionMsg("");
  try {
    const fd = new FormData();
    fd.append("titre", form.titre);
    fd.append("prix", form.prix);
    fd.append("description", form.description);
    if (imageFile) fd.append("image", imageFile);

    if (editingId) {
      await api.patch(`/books/${editingId}`, fd);
      setActionMsg("Livre modifié.");
    } else {
      await api.post("/books", fd);
      setActionMsg("Livre ajouté.");
    }

    cancelEdit();
    fetchBooks();
  } catch (err) {
    setActionMsg(err.response?.data?.message || "Erreur lors de l'enregistrement.");
  } finally {
    setSubmitting(false);
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce livre ?")) return;
    setActionMsg("");
    try {
      await api.delete(`/books/${id}`);
      setActionMsg("Livre supprimé.");
      setBooks((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      setActionMsg(err.response?.data?.message || "Erreur lors de la suppression.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Gestion du catalogue</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-sm p-4 mb-6 space-y-3 max-w-lg"
      >
        <h2 className="font-bold text-slate-700">
          {editingId ? "Modifier le livre" : "Ajouter un livre"}
        </h2>
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
          type="number"
          name="prix"
          placeholder="Prix (DT)"
          value={form.prix}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className="w-full px-3 py-2 border rounded-lg"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
          rows={3}
        />

        {/* Champ image : upload depuis PC/téléphone */}
        <div>
          <label className="block text-sm text-slate-600 mb-1">Photo du livre</label>
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
            className="w-full text-sm"
          />
          {(imageFile || currentImage) && (
            <img
              src={imageFile ? URL.createObjectURL(imageFile) : `/uploads/books/${currentImage}`}
              alt="Aperçu"
              className="h-24 mt-2 rounded object-cover"
            />
          )}
        </div>

        {actionMsg && <p className="text-slate-600 text-sm">{actionMsg}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50"
          >
            {submitting ? "Enregistrement..." : editingId ? "Enregistrer" : "Ajouter"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2 border rounded-lg hover:bg-slate-100"
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      {loading && <p className="text-slate-500">Chargement...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="space-y-3">
        {books.map((b) => (
          <div
            key={b._id}
            className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              {b.image ? (
  <img
    src={`/uploads/books/${b.image}`}
    alt={b.titre}
    className="w-12 h-12 object-cover rounded"
  />
) : (
  <div className="w-12 h-12 bg-slate-100 rounded flex items-center justify-center text-slate-400 text-xs">
    N/A
  </div>
)}
              <div>
                <p className="font-bold text-slate-800">{b.titre}</p>
                <p className="text-sm text-slate-500">{b.prix} DT</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(b)}
                className="px-4 py-2 border rounded-lg hover:bg-slate-100 text-sm"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(b._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BooksManagement;