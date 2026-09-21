import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-56 bg-slate-800 text-white flex flex-col p-4">
        <h2 className="font-bold text-lg mb-6">Espace Admin</h2>
        <nav className="flex flex-col gap-2 flex-1">
  <Link to="/admin" className="hover:text-slate-300">Dashboard</Link>
  <Link to="/admin/ressources" className="hover:text-slate-300">Gestion ressources</Link>
  <Link to="/admin/validation-ressources" className="hover:text-slate-300">Validation ressources</Link>
  <Link to="/admin/validation-livres" className="hover:text-slate-300">Validation livres</Link>
  <Link to="/admin/validation-blog" className="hover:text-slate-300">Validation blog</Link>
  <Link to="/admin/commandes" className="hover:text-slate-300">Commandes</Link>
  <Link to="/admin/livres" className="hover:text-slate-300">Gestion livres</Link>
  <Link to="/admin/contributeurs" className="hover:text-slate-300">Contributeurs</Link>
  <Link to="/admin/blog" className="hover:text-slate-300">Blog</Link>
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

export default AdminLayout;