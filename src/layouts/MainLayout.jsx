import { Outlet, Link } from "react-router-dom";
import { useLang } from "../context/LangContext.jsx";

function MainLayout() {
  const { lang, setLang, t } = useLang();

  return (
    <div className="min-h-screen flex flex-col bg-cream font-sans">
      <header className="bg-cream/95 backdrop-blur-sm border-b border-stone-light sticky top-0 z-40">
        <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Le Génie" className="h-10 w-10 object-contain" />
            <div className="leading-tight">
              <p className="font-serif text-lg text-charcoal">Le Génie</p>
              <p className="text-[9px] tracking-[0.2em] text-stone-faint">BAC SCIENCES</p>
            </div>
          </Link>
          <div className="flex items-center gap-7 text-sm text-charcoal">
            <Link to="/ressources" className="hover:text-indigo-blue transition-colors">{t("resources")}</Link>
            <Link to="/livres" className="hover:text-indigo-blue transition-colors">{t("books")}</Link>
            <Link to="/blog" className="hover:text-indigo-blue transition-colors">{t("blog")}</Link>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="px-2 py-1 border border-stone-light rounded-md text-xs bg-transparent"
            >
              <option value="fr">FR</option>
              <option value="ar">AR</option>
            </select>
          </div>
        </nav>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        <Outlet />
      </main>

      <footer className="bg-charcoal text-cream/70 py-8 text-center text-xs">
        © {new Date().getFullYear()} Le Génie Bac Sciences
      </footer>
    </div>
  );
}

export default MainLayout;