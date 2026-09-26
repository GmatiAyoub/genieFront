import { useEffect, useState } from "react";
import api from "../api/axiosInstance.js";
import { useLang } from "../context/LangContext.jsx";

function Books() {
  const { t } = useLang();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedBook, setSelectedBook] = useState(null);
  const [form, setForm] = useState({ nomClient: "", telephone: "", adresse: "" });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [formError, setFormError] = useState("");

  const isValidTunisianPhone = (phone) => {
    const cleaned = phone.replace(/\s/g, "");
    return /^(\+216|216)?[24579]\d{7}$/.test(cleaned);
  };

  useEffect(() => {
    api
      .get("/books")
      .then((res) => setBooks(res.data))
      .catch(() => setError("Impossible de charger le catalogue."))
      .finally(() => setLoading(false));
  }, []);

  const openOrderForm = (book) => {
    setSelectedBook(book);
    setForm({ nomClient: "", telephone: "", adresse: "" });
    setSuccessMsg("");
    setFormError("");
  };

  const closeOrderForm = () => setSelectedBook(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidTunisianPhone(form.telephone)) {
      setFormError("Numéro de téléphone invalide (8 chiffres tunisiens, ex: 20123456).");
      return;
    }

    setSubmitting(true);
    setFormError("");
    try {
      const res = await api.post("/orders", {
        livre: selectedBook._id,
        ...form,
      });
      setSuccessMsg(res.data.message);
    } catch (err) {
      setFormError(err.response?.data?.message || "Erreur lors de l'envoi de la commande.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-stone-muted text-sm">{t("loading")}</p>;
  if (error) return <p className="text-red-600 text-sm">{error}</p>;

  return (
    <div>
      <p className="text-xs tracking-[0.2em] text-gold uppercase mb-2">{t("catalog")}</p>
      <h1 className="font-serif text-3xl text-charcoal mb-8">{t("catalog")}</h1>

      {books.length === 0 && <p className="text-stone-muted text-sm">{t("noBooks")}</p>}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((b) => (
          <div
            key={b._id}
            className="bg-white border border-stone-light rounded-lg overflow-hidden flex flex-col hover:border-gold transition-colors"
          >
            {b.image ? (
              <img src={`/uploads/books/${b.image}`} alt={b.titre} className="h-44 w-full object-cover" />
            ) : (
              <div className="h-44 w-full bg-cream flex items-center justify-center text-stone-faint text-sm">
                Pas d'image
              </div>
            )}
            <div className="p-5 flex flex-col flex-1">
              <h2 className="font-serif text-lg text-charcoal">{b.titre}</h2>
              {b.description && (
                <p className="text-sm text-stone-muted mt-1 line-clamp-2">{b.description}</p>
              )}
              <p className="text-lg font-serif text-gold mt-3">{b.prix} DT</p>
              <button
                onClick={() => openOrderForm(b)}
                className="mt-4 px-4 py-2.5 bg-charcoal text-cream rounded-md text-sm hover:bg-indigo-blue transition-colors"
              >
                {t("order")}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedBook && (
        <div className="fixed inset-0 bg-charcoal/50 flex items-center justify-center p-4 z-50">
          <div className="bg-cream rounded-xl p-7 w-full max-w-md">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-serif text-lg text-charcoal">
                {t("orderModalTitle")} · {selectedBook.titre}
              </h3>
              <button onClick={closeOrderForm} className="text-stone-muted hover:text-charcoal">
                ✕
              </button>
            </div>

            {successMsg ? (
              <div className="text-center py-6">
                <p className="text-indigo-blue font-medium mb-5">{successMsg}</p>
                <button
                  onClick={closeOrderForm}
                  className="px-5 py-2.5 bg-charcoal text-cream rounded-md text-sm"
                >
                  {t("close")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  name="nomClient"
                  placeholder={t("fullName")}
                  value={form.nomClient}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-stone-light rounded-md text-sm bg-white focus:outline-none focus:border-indigo-blue"
                />
                <input
                  type="tel"
                  name="telephone"
                  placeholder={t("phone") + " (ex: 20123456)"}
                  value={form.telephone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-stone-light rounded-md text-sm bg-white focus:outline-none focus:border-indigo-blue"
                />
                <input
                  type="text"
                  name="adresse"
                  placeholder={t("address")}
                  value={form.adresse}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-stone-light rounded-md text-sm bg-white focus:outline-none focus:border-indigo-blue"
                />

                {formError && <p className="text-red-600 text-xs">{formError}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-4 py-3 bg-charcoal text-cream rounded-md text-sm hover:bg-indigo-blue transition-colors disabled:opacity-50"
                >
                  {submitting ? t("sending") : t("confirmOrder")}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Books;