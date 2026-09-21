import { useEffect, useState } from "react";
import api from "../api/axiosInstance.js";
import { useLang } from "../context/LangContext.jsx";

function Blog() {
  const { t } = useLang();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/articles")
      .then((res) => setArticles(res.data))
      .catch(() => setError("Impossible de charger les actualités."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate-500">{t("loading")}</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">{t("blogTitle")}</h1>

      {articles.length === 0 && <p className="text-slate-500">{t("noArticles")}</p>}

      <div className="space-y-4">
        {articles.map((a) => (
          <article key={a._id} className="bg-white rounded-lg shadow-sm p-5">
            <h2 className="text-lg font-bold text-slate-800 mb-2" dir={a.rtl ? "rtl" : "ltr"}>
              {a.titre}
            </h2>
            <p className="text-slate-600 whitespace-pre-line" dir={a.rtl ? "rtl" : "ltr"}>
              {a.contenu}
            </p>
            <p className="text-xs text-slate-400 mt-3">
              {new Date(a.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Blog;