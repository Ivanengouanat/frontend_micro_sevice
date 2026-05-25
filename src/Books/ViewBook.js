import React, { useEffect, useState , useCallback} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASES, readApiError } from "../utils/api";

function ViewBook() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BOOKS_API = API_BASES.books;

  

  

const fetchBook = useCallback(async () => {
  setLoading(true);
  setError(null);

  try {
    const res = await fetch(`${BOOKS_API}/books/${id}`);

    if (!res.ok) throw new Error(await readApiError(res, "Livre introuvable"));

    const data = await res.json();
    setBook(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}, [id, BOOKS_API]);

useEffect(() => {
    fetchBook();
  }, [id, fetchBook]);

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          ← Retour
        </button>
        <h2>Détails du livre</h2>
      </div>

      {/* LOADING */}
      {loading && (
        <div style={styles.center}>
          <div style={styles.spinner}></div>
          <p>Chargement...</p>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div style={styles.errorCard}>
          <p>⚠️ {error}</p>
          <button onClick={fetchBook} style={styles.retryBtn}>
            Réessayer
          </button>
        </div>
      )}

      {/* BOOK */}
      {book && !loading && (
        <div style={styles.card}>
          <div style={styles.top}>
            <span style={styles.badge}>#{book.id}</span>
            <span style={{
              ...styles.status,
              color: book.available ? "#27ae60" : "#c0392b",
            }}>
              {book.available ? "Disponible" : "Emprunté"}
            </span>
          </div>

          <h1 style={styles.title}>{book.title}</h1>

          <p style={styles.author}>
            ✍️ <strong>{book.author}</strong>
          </p>

          {/* <div style={styles.actions}>
            <button style={styles.editBtn}>Modifier</button>
            <button style={styles.deleteBtn}>Supprimer</button>
          </div> */}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "auto",
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "20px",
  },

  backBtn: {
    border: "none",
    background: "#eee",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  center: {
    textAlign: "center",
    padding: "40px",
  },

  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #eee",
    borderTop: "4px solid #3498db",
    borderRadius: "50%",
    margin: "auto",
    animation: "spin 1s linear infinite",
  },

  card: {
    padding: "25px",
    borderRadius: "16px",
    background: "#fff",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    border: "1px solid #eee",
  },

  top: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },

  badge: {
    background: "#3498db",
    color: "#fff",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "0.8rem",
  },

  status: {
    color: "#27ae60",
    fontWeight: "bold",
  },

  title: {
    margin: "10px 0",
    fontSize: "2rem",
    color: "#2c3e50",
  },

  author: {
    color: "#7f8c8d",
    fontSize: "1.1rem",
  },

  // actions: {
  //   marginTop: "20px",
  //   display: "flex",
  //   gap: "10px",
  // },

  editBtn: {
    flex: 1,
    padding: "10px",
    border: "none",
    background: "#f39c12",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
  },

  deleteBtn: {
    flex: 1,
    padding: "10px",
    border: "none",
    background: "#e74c3c",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
  },

  errorCard: {
    padding: "20px",
    background: "#ffeaea",
    borderRadius: "10px",
    textAlign: "center",
  },

  retryBtn: {
    marginTop: "10px",
    padding: "8px 15px",
    border: "none",
    background: "#3498db",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default ViewBook;
