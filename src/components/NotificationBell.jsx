import { useEffect, useState } from "react";
import api from "../api/axiosInstance.js";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

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
    const interval = setInterval(fetchNotifications, 15000); // rafraîchit toutes les 15s
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleOpen = async () => {
    setOpen((v) => !v);
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      fetchNotifications();
    } catch (err) {
      // silencieux
    }
  };

  return (
    <div className="relative">
      <button onClick={handleOpen} className="relative text-white hover:text-slate-300">
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white text-slate-800 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
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
            <div
              key={n._id}
              className={`p-3 text-sm border-b last:border-0 ${!n.read ? "bg-slate-50 font-medium" : "text-slate-500"}`}
            >
              {n.message}
              <p className="text-xs text-slate-400 mt-1">
                {new Date(n.createdAt).toLocaleString("fr-FR")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;