import { useState } from "react";
import api from "../../api/axiosInstance.js";

function SubmitArticle() {
  const [form, setForm] = useState({ titre: "", contenu: "", rtl: false });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg("");
    try {
      await api.post("/articles", form);
      setMsg("Article soumis pour validation.");
      setForm({ titre: "", contenu: "", rtl: false });
    } catch (err) {
      setMsg(err.response?.data?.message || "Erreur lors de la soumission.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Soumettre un article</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-4 max-w-lg space-y-3">
        <input type="text" name="titre" placeholder="Titre" value={form.titre} onChange={handleChange} required dir={form.rtl ? "rtl" : "ltr"} className="w-full px-3 py-2 border rounded-lg" />
        <textarea name="contenu" placeholder="Contenu" value={form.contenu} onChange={handleChange} required rows={5} dir={form.rtl ? "rtl" : "ltr"} className="w-full px-3 py-2 border rounded-lg" />
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" name="rtl" checked={form.rtl} onChange={handleChange} />
          Afficher de droite à gauche
        </label>
        {msg && <p className="text-slate-600 text-sm">{msg}</p>}
        <button type="submit" disabled={submitting} className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50">
          {submitting ? "Envoi..." : "Soumettre"}
        </button>
      </form>
    </div>
  );
}

export default SubmitArticle;