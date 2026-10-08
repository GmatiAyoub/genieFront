import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import NotificationBell from "../components/NotificationBell.jsx";

function ContributorLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = "text-sm text-cream/70 hover:text-gold transition-colors";

  return (
    <div className="min-h-screen flex bg-cream font-sans">
      <aside className="w-60 bg-charcoal text-cream flex flex-col p-5">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-serif text-lg">Le Génie</p>
            <p className="text-[9px] tracking-[0.2em] text-gold">ESPACE CONTRIBUTEUR</p>
          </div>
          <NotificationBell />
        </div>
        <nav className="flex flex-col gap-3 flex-1">
          <Link to="/contributeur" className={linkClass}>Dashboard</Link>
          <Link to="/contributeur/mes-ressources" className={linkClass}>Mes ressources</Link>
          <Link to="/contributeur/soumettre" className={linkClass}>Soumettre une ressource</Link>
          <Link to="/contributeur/mes-livres" className={linkClass}>Mes livres</Link>
          <Link to="/contributeur/soumettre-livre" className={linkClass}>Soumettre un livre</Link>
          <Link to="/contributeur/mes-articles" className={linkClass}>Mes blogs</Link>
          <Link to="/contributeur/soumettre-article" className={linkClass}>Soumettre un blog</Link>
          <Link to="/contributeur/mot-de-passe" className={linkClass}>Mot de passe</Link>
        </nav>
        <div className="pt-4 border-t border-cream/10">
          <p className="text-xs text-cream/50 mb-2">{user?.nom}</p>
          <button onClick={handleLogout} className="text-left text-xs text-red-300 hover:text-red-200">
            Déconnexion
          </button>
        </div>
      </aside>
      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
}

export default ContributorLayout;