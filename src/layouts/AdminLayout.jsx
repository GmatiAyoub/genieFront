import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import NotificationBell from "../components/NotificationBell.jsx";

function AdminLayout() {
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
            <p className="text-[9px] tracking-[0.2em] text-gold">ESPACE ADMIN</p>
          </div>
          <NotificationBell />
        </div>
        <nav className="flex flex-col gap-3 flex-1">
          <Link to="/admin" className={linkClass}>Dashboard</Link>
          <Link to="/admin/ressources" className={linkClass}>Gestion ressources</Link>
          <Link to="/admin/validation-ressources" className={linkClass}>Validation ressources</Link>
          <Link to="/admin/validation-livres" className={linkClass}>Validation livres</Link>
          <Link to="/admin/validation-blog" className={linkClass}>Validation blog</Link>
          <Link to="/admin/commandes" className={linkClass}>Commandes</Link>
          <Link to="/admin/livres" className={linkClass}>Gestion livres</Link>
          <Link to="/admin/contributeurs" className={linkClass}>Contributeurs</Link>
          <Link to="/admin/blog" className={linkClass}>Blog</Link>
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

export default AdminLayout;