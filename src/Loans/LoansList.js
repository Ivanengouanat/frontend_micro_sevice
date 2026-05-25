import { useEffect, useState, useCallback } from "react";

import { getHistory, returnBook } from "./LoanService";
import { getCurrentUserId } from "../utils/auth";

function LoansList() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  
  const userId = getCurrentUserId();

  const loadLoans = useCallback(() => {
    if (!userId) {
      setLoans([]);
      return;
    }

    setLoading(true);
    setMessage("");

    getHistory(userId)
      .then((data) => {
        setLoans(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des emprunts:", err);
        setMessage(err.message || "Impossible de charger les emprunts");
        setLoans([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    loadLoans();
  }, [userId, loadLoans]);

  const handleReturn = async (loanId) => {
    if (!userId) return;

    try {
      setLoading(true);
      await returnBook(loanId, userId);
      setMessage("Livre retourné avec succès");
      await loadLoans();
    } catch (err) {
      setMessage(err.message || "Erreur retour");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Intl.DateTimeFormat("fr-FR").format(new Date(date));
  };

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

      {message && (
        <p style={styles.message}>
          {message}
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
              <th style={styles.th}>⏳ Échéance</th>
              <th style={styles.th}>📅 Date de retour</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {(loans?.length ?? 0) === 0 ? (
              <tr>
                <td colSpan={6} style={styles.empty}>
                  Aucun emprunt trouvé
                </td>
              </tr>
            ) : (
              loans.map((l) => (
                <tr key={l?.id ?? Math.random()} style={styles.tr}>
                  <td style={styles.td}>
                    <strong>{l?.bookTitle || `Livre #${l?.bookId ?? "-"}`}</strong>
                    {l?.bookAuthor && <div style={styles.muted}>{l.bookAuthor}</div>}
                  </td>

                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        backgroundColor:
                          l?.overdue
                            ? "#c0392b"
                            : l?.status === "BORROWED"
                            ? "#f39c12" // orange
                            : l?.status === "RETURNED"
                            ? "#2ecc71" // vert
                            : "#7f8c8d", // gris
                      }}
                    >
                      {l?.overdue
                        ? "En retard"
                        : l?.status === "BORROWED"
                        ? "En cours"
                        : l?.status === "RETURNED"
                        ? "Retourné"
                        : "Inconnu"}
                    </span>
                  </td>

                  <td style={styles.td}>{formatDate(l?.borrowDate)}</td>
                  <td style={styles.td}>{formatDate(l?.dueDate)}</td>
                  <td style={styles.td}>{formatDate(l?.returnDate)}</td>
                  <td style={styles.td}>
                    {l?.status === "BORROWED" ? (
                      <button
                        style={styles.returnBtn}
                        disabled={loading}
                        onClick={() => handleReturn(l.id)}
                      >
                        Retourner
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
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

  message: {
    padding: "10px 12px",
    borderRadius: "8px",
    backgroundColor: "#eef2ff",
    color: "#3730a3",
    marginBottom: "12px",
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

  muted: {
    marginTop: "4px",
    color: "#64748b",
    fontSize: "0.8rem",
  },

  returnBtn: {
    padding: "7px 12px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#2ecc71",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
  },
};
