import { useEffect, useState } from "react";
import api from "../api/axiosInstance.js";
import { useLang } from "../context/LangContext.jsx";

function Resources() {
  const { t } = useLang();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [matiere, setMatiere] = useState("");
  const [type, setType] = useState("");

  const fetchResources = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (matiere) params.matiere = matiere;
      if (type) params.type = type;
      const res = await api.get("/resources", { params });
      setResources(res.data);
    } catch (err) {
      setError("Impossible de charger les ressources pour le moment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matiere, type]);

  return (
    <div>
      <p className="text-xs tracking-[0.2em] text-gold uppercase mb-2">{t("resourcesTitle")}</p>
      <h1 className="font-serif text-3xl text-charcoal mb-8">{t("resourcesTitle")}</h1>

      <div className="flex flex-wrap gap-3 mb-8">
        <input
          type="text"
          placeholder={t("filterBySubject")}
          value={matiere}
          onChange={(e) => setMatiere(e.target.value)}
          className="px-4 py-2 border border-stone-light rounded-md text-sm w-64 bg-white focus:outline-none focus:border-indigo-blue"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-4 py-2 border border-stone-light rounded-md text-sm bg-white focus:outline-none focus:border-indigo-blue"
        >
          <option value="">{t("allTypes")}</option>
          <option value="Cours">{t("typeCourse")}</option>
          <option value="Série">{t("typeSeries")}</option>
          <option value="Devoir">{t("typeHomework")}</option>
        </select>
      </div>

      {loading && <p className="text-stone-muted text-sm">{t("loading")}</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {!loading && !error && resources.length === 0 && (
        <p className="text-stone-muted text-sm">{t("noResources")}</p>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((r) => (
          <div
            key={r._id}
            className="bg-white border border-stone-light rounded-lg p-5 flex flex-col hover:border-gold transition-colors"
          >
            <p className="text-[10px] tracking-[0.15em] text-stone-faint uppercase mb-2">
              {r.type} · {r.matiere}
            </p>
            <h2 className="font-serif text-lg text-charcoal mb-4">{r.titre}</h2>
            <a
  href={r.fichier}
  target="_blank"
  rel="noopener noreferrer"
  className="mt-auto px-4 py-2.5 bg-charcoal text-cream text-center rounded-md text-sm hover:bg-indigo-blue transition-colors"
>
  {t("download")}
</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Resources;