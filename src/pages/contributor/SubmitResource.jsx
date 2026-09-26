import { useState } from "react";
import api from "../../api/axiosInstance.js";

function SubmitResource() {
  const [form, setForm] = useState({ titre: "", matiere: "", type: "Cours" });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setMsg("Merci de choisir un fichier."); return; }
    setSubmitting(true);
    setMsg("");
    try {
      const fd = new FormData();
      fd.append("titre", form.titre);
      fd.append("matiere", form.matiere);
      fd.append("type", form.type);
      fd.append("fichier", file);
      await api.post("/resources", fd);
      setMsg("Ressource soumise pour validation.");
      setForm({ titre: "", matiere: "", type: "Cours" });
      setFile(null);
    } catch (err) {
      setMsg(err.response?.data?.message || "Erreur lors de la soumission.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <p className="text-xs tracking-[0.2em] text-gold uppercase mb-2">Soumission</p>
      <h1 className="font-serif text-3xl text-charcoal mb-8">Soumettre une ressource</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-stone-light rounded-lg p-6 max-w-md space-y-3">
        <input type="text" name="titre" placeholder="Titre" value={form.titre} onChange={handleChange} required
          className="w-full px-4 py-2.5 border border-stone-light rounded-md text-sm focus:outline-none focus:border-indigo-blue" />
        <input type="text" name="matiere" placeholder="Matière (ex: Maths)" value={form.matiere} onChange={handleChange} required
          className="w-full px-4 py-2.5 border border-stone-light rounded-md text-sm focus:outline-none focus:border-indigo-blue" />
        <select name="type" value={form.type} onChange={handleChange}
          className="w-full px-4 py-2.5 border border-stone-light rounded-md text-sm focus:outline-none focus:border-indigo-blue">
          <option value="Cours">Cours</option>
          <option value="Série">Série</option>
          <option value="Devoir">Devoir</option>
        </select>
        <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files[0] || null)} required className="w-full text-sm" />
        {msg && <p className="text-stone-muted text-xs">{msg}</p>}
        <button type="submit" disabled={submitting}
          className="px-5 py-2.5 bg-charcoal text-cream rounded-md text-sm hover:bg-indigo-blue transition-colors disabled:opacity-50">
          {submitting ? "Envoi..." : "Soumettre"}
        </button>
      </form>
    </div>
  );
}

export default SubmitResource;