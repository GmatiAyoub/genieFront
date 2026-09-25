import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance.js";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      // silencieux
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      fetchNotifications();
    } catch (err) {
      // silencieux
    }
  };

  const handleClickNotification = async (notif) => {
    setOpen(false);
    if (!notif.read) {
      try {
        await api.patch(`/notifications/${notif._id}/read`);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, read: true } : n))
        );
      } catch (err) {
        // silencieux
      }
    }
    if (notif.link) navigate(notif.link);
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} className="relative text-white hover:text-slate-300">
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* overlay pour fermer au clic en dehors */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div className="fixed top-4 left-60 w-80 bg-white text-slate-800 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center p-3 border-b">
              <span className="font-semibold text-sm">Notifications</span>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead} className="text-xs text-blue-600 hover:underline">
                  Tout marquer lu
                </button>
              )}
            </div>
            {notifications.length === 0 && (
              <p className="p-3 text-sm text-slate-400">Aucune notification.</p>
            )}
            {notifications.map((n) => (
              <button
                key={n._id}
                onClick={() => handleClickNotification(n)}
                className={`w-full text-left p-3 text-sm border-b last:border-0 hover:bg-slate-100 transition-colors ${
                  !n.read ? "bg-slate-50 font-medium" : "text-slate-500"
                }`}
              >
                {n.message}
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(n.createdAt).toLocaleString("fr-FR")}
                </p>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default NotificationBell;