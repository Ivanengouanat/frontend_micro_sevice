import { Outlet, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function Layout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  //  fermer le menu si clic en dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={styles.container}>
      {/* TOPBAR */}
      <header style={styles.header}>
        <h2 style={styles.logo}>📚 Book App</h2>

        <nav style={styles.nav}>
          <button onClick={() => navigate("/books")} style={styles.button}>
            Livres
          </button>

          {/*  MENU UTILISATEUR */}
          <div style={styles.userMenu} ref={menuRef}>
            <button
              onClick={() => setOpen(!open)}
              style={styles.iconButton}
            >
              👤 
            </button>

            {open && (
              <div style={styles.dropdown}>
                <div
                  style={styles.dropdownItem}
                  onClick={() => {
                    navigate("/profile");
                    setOpen(false);
                  }}
                >
                  👤 Profil
                </div>

                <div
                  style={{ ...styles.dropdownItem, color: "#e74c3c" }}
                  onClick={handleLogout}
                >
                  🚪 Logout
                </div>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* CONTENU */}
      <main style={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f4f6f8",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#2c3e50",
    color: "#fff",
  },
  logo: {
    margin: 0,
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  button: {
    padding: "8px 12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  //  USER MENU
  userMenu: {
    position: "relative",
  },
  iconButton: {
    fontSize: "20px",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#fff",
  },

  //  DROPDOWN
  dropdown: {
    position: "absolute",
    top: "40px",
    right: 0,
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    minWidth: "150px",
    overflow: "hidden",
  },
  dropdownItem: {
    padding: "10px",
    cursor: "pointer",
    borderBottom: "1px solid #eee",
    color:"black"
  },

  content: {
    padding: "2rem",
  },
};