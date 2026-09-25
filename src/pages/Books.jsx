import { useEffect, useState } from "react";
import api from "../api/axiosInstance.js";
import { useLang } from "../context/LangContext.jsx";


const isValidTunisianPhone = (phone) => {
  const cleaned = phone.replace(/\s/g, "");
  return /^(\+216|216)?[24579]\d{7}$/.test(cleaned);
};
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
    setFormError("Numéro de téléphone invalide (8 chiffres tunisiens, ex: 20123456 ou +21620123456).");
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

  if (loading) return <p className="text-slate-500">{t("loading")}</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">{t("catalog")}</h1>

      {books.length === 0 && <p className="text-slate-500">{t("noBooks")}</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((b) => (
          <div key={b._id} className="bg-white rounded-lg shadow-sm p-4 flex flex-col">
            {b.image ? (
              <img
                src={`/uploads/books/${b.image}`}
                alt={b.titre}
                className="h-40 w-full object-cover rounded mb-3"
              />
            ) : (
              <div className="h-40 w-full bg-slate-100 rounded mb-3 flex items-center justify-center text-slate-400 text-sm">
                Pas d'image
              </div>
            )}
            <h2 className="font-bold text-slate-800">{b.titre}</h2>
            {b.description && (
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">{b.description}</p>
            )}
            <p className="text-lg font-semibold text-slate-800 mt-2">{b.prix} DT</p>
            <button
              onClick={() => openOrderForm(b)}
              className="mt-3 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 text-sm"
            >
              {t("order")}
            </button>
          </div>
        ))}
      </div>

      {selectedBook && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-800">
                {t("orderModalTitle")} : {selectedBook.titre}
              </h3>
              <button onClick={closeOrderForm} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            {successMsg ? (
              <div className="text-center py-6">
                <p className="text-green-600 font-medium mb-4">{successMsg}</p>
                <button
                  onClick={closeOrderForm}
                  className="px-4 py-2 bg-slate-800 text-white rounded-lg"
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
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <input
  type="tel"
  name="telephone"
  placeholder="Téléphone (ex: 20123456)"
  value={form.telephone}
  onChange={handleChange}
  required
  className="w-full px-3 py-2 border rounded-lg"
/>
                <input
                  type="text"
                  name="adresse"
                  placeholder={t("address")}
                  value={form.adresse}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />

                {formError && <p className="text-red-600 text-sm">{formError}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50"
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