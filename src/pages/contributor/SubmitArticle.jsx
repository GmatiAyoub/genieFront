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
      setMsg("Blog soumis pour validation.");
      setForm({ titre: "", contenu: "", rtl: false });
    } catch (err) {
      setMsg(err.response?.data?.message || "Erreur lors de la soumission.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <p className="text-xs tracking-[0.2em] text-gold uppercase mb-2">Soumission</p>
      <h1 className="font-serif text-3xl text-charcoal mb-8">Soumettre un blog</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-stone-light rounded-lg p-6 max-w-lg space-y-3">
        <input type="text" name="titre" placeholder="Titre" value={form.titre} onChange={handleChange} required
          dir={form.rtl ? "rtl" : "ltr"}
          className="w-full px-4 py-2.5 border border-stone-light rounded-md text-sm focus:outline-none focus:border-indigo-blue" />
        <textarea name="contenu" placeholder="Contenu" value={form.contenu} onChange={handleChange} required rows={5}
          dir={form.rtl ? "rtl" : "ltr"}
          className="w-full px-4 py-2.5 border border-stone-light rounded-md text-sm focus:outline-none focus:border-indigo-blue" />
        <label className="flex items-center gap-2 text-xs text-stone-muted">
          <input type="checkbox" name="rtl" checked={form.rtl} onChange={handleChange} />
          Afficher de droite à gauche
        </label>
        {msg && <p className="text-stone-muted text-xs">{msg}</p>}
        <button type="submit" disabled={submitting}
          className="px-5 py-2.5 bg-charcoal text-cream rounded-md text-sm hover:bg-indigo-blue transition-colors disabled:opacity-50">
          {submitting ? "Envoi..." : "Soumettre"}
        </button>
      </form>
    </div>
  );
}

export default SubmitArticle;