import { useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { returnBook } from "./LoanService";

function ReturnBook() {

  const location = useLocation();
  const navigate = useNavigate();

  // si on vient depuis ListBooks
  const prefilledLoanId =
    location.state?.loanId || "";

  const [loanId, setLoanId] =
    useState(prefilledLoanId);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // true si ID transmis par navigation
  const isReadonly =
    Boolean(prefilledLoanId);

  const handleReturn =
    async () => {

      setMessage("");

      if (!user) {
        setMessage(
          "❌ Utilisateur non connecté"
        );
        return;
      }

      if (!loanId) {
        setMessage(
          "⚠️ ID requis"
        );
        return;
      }

      if (Number(loanId) < 1) {
        setMessage(
          "⚠️ ID invalide"
        );
        return;
      }

      try {
        setLoading(true);

        await returnBook(
          loanId,
          user.id
        );

        setMessage(
          "✅ Livre retourné avec succès"
        );

        setTimeout(() => {
          navigate("/books");
        }, 1000);

      } catch (err) {
        setMessage(
          err.message ||
          "Erreur retour"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h2 style={styles.title}>
          ↩️ Retourner un livre
        </h2>

        <input
          type="text"
          value={loanId}
          onChange={(e) =>
            setLoanId(
              e.target.value
            )
          }
          disabled={isReadonly}
          style={{
            ...styles.input,

            backgroundColor:
              isReadonly
                ? "#f1f5f9"
                : "white",

            cursor:
              isReadonly
                ? "not-allowed"
                : "text",
          }}
        />

        <button
          style={styles.button}
          onClick={
            handleReturn
          }
          disabled={
            loading
          }
        >
          {loading
            ? "Retour..."
            : "Retourner"}
        </button>

        {message && (
          <p style={styles.message}>
            {message}
          </p>
        )}

      </div>
    </div>
  );
}

export default ReturnBook;


const styles = {
  container: {
    display: "flex",
    justifyContent:
      "center",
    alignItems:
      "center",
    minHeight: "80vh",
    backgroundColor:
      "#f8fafc",
  },

  card: {
    width: "400px",
    backgroundColor:
      "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow:
      "0 4px 20px rgba(0,0,0,0.08)",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#1e293b",
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border:
      "1px solid #ddd",
    marginBottom: "15px",
    fontSize: "15px",
    boxSizing:
      "border-box",
  },

  button: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    backgroundColor:
      "#2ecc71",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "15px",
  },

  message: {
    marginTop: "15px",
    textAlign: "center",
    fontWeight: "500",
  },
};
