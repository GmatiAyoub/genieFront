import { useState } from "react";
import api from "../api/axiosInstance.js";
import { useAuth } from "../context/AuthContext.jsx";

function ChangePassword() {
  const { user } = useAuth();
  const minLength = user?.role === "admin" ? 12 : 8;
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (form.newPassword.length < minLength) {
      setMsg({ type: "error", text: `Le nouveau mot de passe doit contenir au moins ${minLength} caractères.` });
      return;
    }
    if (form.newPassword !== form.confirm) {
      setMsg({ type: "error", text: "La confirmation ne correspond pas au nouveau mot de passe." });
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.patch("/auth/password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setMsg({ type: "success", text: res.data.message });
      setForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Erreur lors du changement de mot de passe." });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 border border-stone-light rounded-md text-sm focus:outline-none focus:border-indigo-blue";

  return (
    <div>
      <p className="text-xs tracking-[0.2em] text-gold uppercase mb-2">Sécurité</p>
      <h1 className="font-serif text-3xl text-charcoal mb-8">Changer mon mot de passe</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-stone-light rounded-lg p-6 max-w-md space-y-3">
        <input type="password" name="currentPassword" placeholder="Mot de passe actuel"
          value={form.currentPassword} onChange={handleChange} required autoComplete="current-password" className={inputClass} />
        <input type="password" name="newPassword" placeholder={`Nouveau mot de passe (${minLength} caractères minimum)`}
          value={form.newPassword} onChange={handleChange} required autoComplete="new-password" className={inputClass} />
        <input type="password" name="confirm" placeholder="Confirmer le nouveau mot de passe"
          value={form.confirm} onChange={handleChange} required autoComplete="new-password" className={inputClass} />

        {msg.text && (
          <p className={`text-xs ${msg.type === "success" ? "text-indigo-blue" : "text-red-600"}`}>{msg.text}</p>
        )}

        <button type="submit" disabled={submitting}
          className="px-5 py-2.5 bg-charcoal text-cream rounded-md text-sm hover:bg-indigo-blue transition-colors disabled:opacity-50">
          {submitting ? "Enregistrement..." : "Modifier le mot de passe"}
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;