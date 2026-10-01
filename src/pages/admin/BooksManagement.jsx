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
  const [currentImage, setCurrentImage] = useState("");
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

  useEffect(() => { fetchBooks(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setImageFile(e.target.files[0] || null);

  const startEdit = (book) => {
    setEditingId(book._id);
    setForm({ titre: book.titre, prix: book.prix, description: book.description || "" });
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
      <p className="text-xs tracking-[0.2em] text-gold uppercase mb-2">Catalogue</p>
      <h1 className="font-serif text-3xl text-charcoal mb-8">Gestion des livres</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-stone-light rounded-lg p-6 mb-8 space-y-3 max-w-md">
        <h2 className="font-serif text-lg text-charcoal mb-1">
          {editingId ? "Modifier le livre" : "Ajouter un livre"}
        </h2>
        <input type="text" name="titre" placeholder="Titre" value={form.titre} onChange={handleChange} required
          className="w-full px-4 py-2.5 border border-stone-light rounded-md text-sm focus:outline-none focus:border-indigo-blue" />
        <input type="number" name="prix" placeholder="Prix (DT)" value={form.prix} onChange={handleChange} required min="0" step="0.01"
          className="w-full px-4 py-2.5 border border-stone-light rounded-md text-sm focus:outline-none focus:border-indigo-blue" />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} rows={3}
          className="w-full px-4 py-2.5 border border-stone-light rounded-md text-sm focus:outline-none focus:border-indigo-blue" />
        <div>
          <label className="block text-xs text-stone-muted mb-1">Photo du livre</label>
          <input type="file" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} className="w-full text-sm" />
          {(imageFile || currentImage) && (
            <img src={imageFile ? URL.createObjectURL(imageFile) : currentImage} alt="Aperçu"
              className="h-24 mt-2 rounded object-cover" />
          )}
        </div>
        {actionMsg && <p className="text-stone-muted text-xs">{actionMsg}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={submitting}
            className="px-5 py-2.5 bg-charcoal text-cream rounded-md text-sm hover:bg-indigo-blue transition-colors disabled:opacity-50">
            {submitting ? "Enregistrement..." : editingId ? "Enregistrer" : "Ajouter"}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="px-5 py-2.5 border border-stone-light rounded-md text-sm hover:bg-cream transition-colors">
              Annuler
            </button>
          )}
        </div>
      </form>

      {loading && <p className="text-stone-muted text-sm">Chargement...</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="space-y-2">
        {books.map((b) => (
          <div key={b._id} className="bg-white border border-stone-light rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {b.image ? (
                <img
  src={b.image}
  alt={b.titre}
  className="w-12 h-12 object-cover rounded"
/>
              ) : (
                <div className="w-12 h-12 bg-cream rounded flex items-center justify-center text-stone-faint text-[10px]">N/A</div>
              )}
              <div>
                <p className="font-serif text-charcoal">{b.titre}</p>
                <p className="text-xs text-gold">{b.prix} DT</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(b)} className="px-4 py-2 border border-stone-light rounded-md text-xs hover:bg-cream transition-colors">
                Modifier
              </button>
              <button onClick={() => handleDelete(b._id)} className="px-4 py-2 bg-red-600 text-white rounded-md text-xs hover:bg-red-700 transition-colors">
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