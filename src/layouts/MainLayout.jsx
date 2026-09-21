import { Outlet, Link } from "react-router-dom";
import { useLang } from "../context/LangContext.jsx";

function MainLayout() {
  const { lang, setLang, t } = useLang();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white shadow-sm">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-slate-800">
            Le Génie Bac Sciences
          </Link>
          <div className="flex items-center gap-6 text-slate-600">
            <Link to="/ressources" className="hover:text-slate-900">{t("resources")}</Link>
            <Link to="/livres" className="hover:text-slate-900">{t("books")}</Link>
            <Link to="/blog" className="hover:text-slate-900">{t("blog")}</Link>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="px-2 py-1 border rounded-lg text-sm"
            >
              <option value="fr">FR</option>
              <option value="ar">AR</option>
            </select>
          </div>
        </nav>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>

      <footer className="bg-white border-t py-6 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} Le Génie Bac Sciences
      </footer>
    </div>
  );
}

export default MainLayout;