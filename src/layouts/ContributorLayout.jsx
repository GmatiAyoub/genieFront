import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function ContributorLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-56 bg-slate-800 text-white flex flex-col p-4">
        <h2 className="font-bold text-lg mb-6">Espace Contributeur</h2>
        <nav className="flex flex-col gap-2 flex-1">
          <Link to="/contributeur" className="hover:text-slate-300">Dashboard</Link>
          <Link to="/contributeur/mes-ressources" className="hover:text-slate-300">Mes ressources</Link>
          <Link to="/contributeur/soumettre" className="hover:text-slate-300">Soumettre une ressource</Link>
          <Link to="/contributeur/mes-livres" className="hover:text-slate-300">Mes livres</Link>
          <Link to="/contributeur/soumettre-livre" className="hover:text-slate-300">Soumettre un livre</Link>
          <Link to="/contributeur/mes-articles" className="hover:text-slate-300">Mes blogs</Link>
<Link to="/contributeur/soumettre-article" className="hover:text-slate-300">Soumettre un blog</Link>
        </nav>
        <p className="text-xs text-slate-400 mb-2">{user?.nom}</p>
        <button onClick={handleLogout} className="text-left text-red-300 hover:text-red-200">
          Déconnexion
        </button>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default ContributorLayout;