import { useState } from "react";
import api from "../../api/axiosInstance.js";

function SubmitBook() {
  const [form, setForm] = useState({ titre: "", prix: "", description: "" });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg("");
    try {
      const fd = new FormData();
      fd.append("titre", form.titre);
      fd.append("prix", form.prix);
      fd.append("description", form.description);
      if (file) fd.append("image", file);

      await api.post("/books", fd);
      setMsg("Livre soumis pour validation.");
      setForm({ titre: "", prix: "", description: "" });
      setFile(null);
    } catch (err) {
      setMsg(err.response?.data?.message || "Erreur lors de la soumission.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Soumettre un livre</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-4 max-w-md space-y-3">
        <input type="text" name="titre" placeholder="Titre" value={form.titre} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
        <input type="number" name="prix" placeholder="Prix (DT)" value={form.prix} onChange={handleChange} required min="0" step="0.01" className="w-full px-3 py-2 border rounded-lg" />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border rounded-lg" />
        <div>
          <label className="block text-sm text-slate-600 mb-1">Photo du livre (optionnel)</label>
          <input type="file" accept="image/png, image/jpeg, image/webp" onChange={(e) => setFile(e.target.files[0] || null)} className="w-full text-sm" />
        </div>
        {msg && <p className="text-slate-600 text-sm">{msg}</p>}
        <button type="submit" disabled={submitting} className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50">
          {submitting ? "Envoi..." : "Soumettre"}
        </button>
      </form>
    </div>
  );
}

export default SubmitBook;