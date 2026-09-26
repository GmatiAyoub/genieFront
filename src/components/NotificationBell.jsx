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
        setNotifications((prev) => prev.map((n) => (n._id === notif._id ? { ...n, read: true } : n)));
      } catch (err) {
        // silencieux
      }
    }
    if (notif.link) navigate(notif.link);
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} className="relative text-gold hover:text-cream transition-colors">
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="fixed top-4 left-64 w-80 bg-white text-charcoal rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto border border-stone-light">
            <div className="flex justify-between items-center p-3 border-b border-stone-light">
              <span className="font-medium text-sm">Notifications</span>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead} className="text-xs text-indigo-blue hover:underline">
                  Tout marquer lu
                </button>
              )}
            </div>
            {notifications.length === 0 && (
              <p className="p-3 text-sm text-stone-faint">Aucune notification.</p>
            )}
            {notifications.map((n) => (
              <button
                key={n._id}
                onClick={() => handleClickNotification(n)}
                className={`w-full text-left p-3 text-sm border-b border-stone-light last:border-0 hover:bg-cream transition-colors ${
                  !n.read ? "bg-cream/60 font-medium" : "text-stone-muted"
                }`}
              >
                {n.message}
                <p className="text-xs text-stone-faint mt-1">
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