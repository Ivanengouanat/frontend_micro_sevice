import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getHistory } from "./LoanService";
import { getCurrentUserId } from "../utils/auth";

function LoansList() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const userId = getCurrentUserId();

  const loadLoans = useCallback(() => {
    if (!userId) {
      setLoans([]);
      return;
    }

    setLoading(true);

    getHistory(userId)
      .then((data) => {
        setLoans(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des emprunts:", err);
        setLoans([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    loadLoans();
  }, [userId, loadLoans]);

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h2 style={styles.title}>📚 Mes emprunts</h2>
      </div>

      {/* USER CHECK */}
      {!userId && (
        <p style={styles.warning}>
          ⚠️ Utilisateur non connecté
        </p>
      )}

      {/* LOADING */}
      {loading && (
        <p style={styles.loading}>
          Chargement des emprunts en cours...
        </p>
      )}

      {/* TABLE */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>📖 Livre</th>
              <th style={styles.th}>📌 Statut</th>
              <th style={styles.th}>📅 Date d’emprunt</th>
              <th style={styles.th}>📅 Date de retour</th>
            </tr>
          </thead>

          <tbody>
            {(loans?.length ?? 0) === 0 ? (
              <tr>
                <td colSpan={4} style={styles.empty}>
                  Aucun emprunt trouvé
                </td>
              </tr>
            ) : (
              loans.map((l) => (
                <tr key={l?.id ?? Math.random()} style={styles.tr}>
                  <td style={styles.td}>{l?.bookId ?? "-"}</td>

                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        backgroundColor:
                          l?.status === "BORROWED"
                            ? "#f39c12" // orange
                            : l?.status === "RETURNED"
                            ? "#2ecc71" // vert
                            : "#7f8c8d", // gris
                      }}
                    >
                      {l?.status === "BORROWED"
                        ? "En cours"
                        : l?.status === "RETURNED"
                        ? "Retourné"
                        : "Inconnu"}
                    </span>
                  </td>

                  <td style={styles.td}>{l?.borrowDate ?? "-"}</td>
                  <td style={styles.td}>{l?.returnDate ?? "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LoansList;

const styles = {
  container: {
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f4f6f8",
    minHeight: "100vh",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  title: {
    margin: 0,
    fontSize: "1.8rem",
    color: "#2c3e50",
    fontWeight: "700",
  },

  warning: {
    color: "#e74c3c",
    fontWeight: "bold",
    marginBottom: "10px",
  },

  loading: {
    color: "#3498db",
    fontStyle: "italic",
    marginBottom: "10px",
  },

  tableWrapper: {
    overflowX: "auto",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    borderRadius: "8px",
    backgroundColor: "white",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    borderRadius: "8px",
    overflow: "hidden",
  },

  th: {
    backgroundColor: "#34495e",
    color: "white",
    textAlign: "left",
    padding: "12px",
    fontWeight: "600",
    fontSize: "0.95rem",
  },

  tr: {
    borderBottom: "1px solid #ecf0f1",
  },

  td: {
    padding: "12px",
    color: "#2c3e50",
    fontSize: "0.9rem",
  },

  empty: {
    textAlign: "center",
    padding: "20px",
    color: "#7f8c8d",
    fontStyle: "italic",
  },

  badge: {
    padding: "6px 12px",
    borderRadius: "12px",
    color: "white",
    fontSize: "13px",
    fontWeight: "600",
    display: "inline-block",
  },
};
