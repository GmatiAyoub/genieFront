import { Link } from "react-router-dom";
import { useLang } from "../context/LangContext.jsx";

function Home() {
  const { t } = useLang();

  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold text-slate-800 mb-4">{t("welcome")}</h1>
      <p className="text-slate-600 max-w-xl mx-auto mb-8">{t("heroText")}</p>
      <div className="flex justify-center gap-4">
        <Link
          to="/ressources"
          className="px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
        >
          {t("seeResources")}
        </Link>
        <Link
          to="/livres"
          className="px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-100"
        >
          {t("seeBooks")}
        </Link>
      </div>
    </div>
  );
}

export default Home;