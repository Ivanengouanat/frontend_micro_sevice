import { useEffect, useState } from "react";
import { getNotifications } from "./NotificationService";

export default function NotificationBell() {

  const [notifications, setNotifications] =
    useState([]);

  const [open, setOpen] = useState(false);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {

    console.log("USER STORAGE =", user);
console.log("USER ID =", user?.id);

    if (!user) return;

    const loadNotifications = async () => {
      try {

        const data =
          await getNotifications(user.id);

        setNotifications(data);

      } catch (err) {
        console.error(err);
      }
    };

    // premier chargement
    loadNotifications();

    // refresh toutes les 3 secondes
    const interval = setInterval(
      loadNotifications,
      3000
    );

    return () => clearInterval(interval);

  }, [user?.id]);

  const unreadCount =
    notifications.length;

  return (
    <div style={styles.wrapper}>

      {/* BOUTON CLOCHE */}
      <button
        style={styles.bellButton}
        onClick={() => setOpen(!open)}
      >
        🔔

        {unreadCount > 0 && (
          <span style={styles.badge}>
            {unreadCount}
          </span>
        )}

      </button>

      {/* DROPDOWN */}
      {open && (
        <div style={styles.dropdown}>

          <h4 style={styles.title}>
            Notifications
          </h4>

          {notifications.length === 0 ? (
            <p style={styles.empty}>
              Aucune notification
            </p>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                style={styles.item}
              >
                <div>
                  {notif.message}
                </div>

                <small style={styles.date}>
                  {notif.createdAt}
                </small>

              </div>
            ))
          )}

        </div>
      )}

    </div>
  );
}

const styles = {

  wrapper: {
    position: "relative",
  },

  bellButton: {
    position: "relative",
    background: "none",
    border: "none",
    color: "white",
    fontSize: "22px",
    cursor: "pointer",
  },

  badge: {
    position: "absolute",
    top: "-5px",
    right: "-8px",
    backgroundColor: "#e74c3c",
    color: "white",
    borderRadius: "50%",
    width: "18px",
    height: "18px",
    fontSize: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },

  dropdown: {
    position: "absolute",
    top: "40px",
    right: 0,
    width: "320px",
    maxHeight: "400px",
    overflowY: "auto",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow:
      "0 8px 25px rgba(0,0,0,0.15)",
    zIndex: 999,
  },

  title: {
    padding: "15px",
    margin: 0,
    borderBottom: "1px solid #eee",
    color: "#2c3e50",
  },

  item: {
    padding: "12px",
    borderBottom: "1px solid #f1f1f1",
    color: "#2c3e50",
  },

  date: {
    color: "#7f8c8d",
  },

  empty: {
    padding: "20px",
    textAlign: "center",
    color: "#999",
  },
};