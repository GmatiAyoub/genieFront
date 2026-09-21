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
      <h1 className="text-2xl font-bold text-slate-800 mb-6">{t("resourcesTitle")}</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder={t("filterBySubject")}
          value={matiere}
          onChange={(e) => setMatiere(e.target.value)}
          className="px-3 py-2 border rounded-lg w-64"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">{t("allTypes")}</option>
          <option value="Cours">{t("typeCourse")}</option>
          <option value="Série">{t("typeSeries")}</option>
          <option value="Devoir">{t("typeHomework")}</option>
        </select>
      </div>

      {loading && <p className="text-slate-500">{t("loading")}</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && resources.length === 0 && (
        <p className="text-slate-500">{t("noResources")}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((r) => (
          <div key={r._id} className="bg-white rounded-lg shadow-sm p-4 flex flex-col">
            <span className="text-xs font-semibold text-slate-500 uppercase mb-1">
              {r.type} — {r.matiere}
            </span>
            <h2 className="font-bold text-slate-800 mb-3">{r.titre}</h2>
            <a
              href={`/uploads/resources/${r.fichier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto px-4 py-2 bg-slate-800 text-white text-center rounded-lg hover:bg-slate-700 text-sm"
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