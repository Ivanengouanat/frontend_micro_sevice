import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ListBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const BOOKS_API = process.env.REACT_APP_BOOKS_API;

  const navigate = useNavigate(); // 🔥 navigation

  useEffect(() => {
    fetch(`${BOOKS_API}/books`)
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [BOOKS_API]);

  return (
    <div style={styles.container}>
      {/*  HEADER */}
      <div style={styles.header}>
        <h2 style={styles.title}>📚 Bibliothèque</h2>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={styles.countBadge}>{books.length} livres</span>

          {/* 🔥 BOUTON CREATE */}
          <button
            style={styles.createBtn}
            onClick={() => navigate("/create")}
          >
            + Ajouter
          </button>
        </div>
      </div>

      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Chargement de la collection...</p>
        </div>
      ) : books.length > 0 ? (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHead}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Titre</th>
                <th style={styles.th}>Auteur</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, index) => (
                <tr
                  key={book.id}
                  style={{
                    ...styles.tr,
                    backgroundColor: index % 2 === 0 ? "#fff" : "#fcfcfc",
                  }}
                >
                  <td style={styles.td}>
                    <code>#{book.id}</code>
                  </td>
                  <td style={styles.tdBold}>{book.title}</td>
                  <td style={styles.td}>{book.author}</td>

                  <td style={styles.td}>
                    {/* 🔥 NAVIGATION VERS VIEW */}
                    <button
                      style={styles.actionBtn}
                      onClick={() => navigate(`/books/${book.id}`)}
                    >
                      Détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={styles.emptyState}>
          <p style={{ fontSize: "3rem" }}>📖</p>
          <h3>Aucun livre trouvé</h3>
          <p>Commencez par ajouter un ouvrage à votre collection.</p>

          {/* CTA CREATE */}
          <button
            style={styles.createBtn}
            onClick={() => navigate("/create")}
          >
            Ajouter un livre
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "10px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    margin: 0,
    color: "#2c3e50",
  },
  countBadge: {
    backgroundColor: "#e8f4fd",
    color: "#3498db",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.9rem",
    fontWeight: "bold",
  },
  tableWrapper: {
    overflowX: "auto",
    border: "1px solid #eee",
    borderRadius: "8px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  tableHead: {
    backgroundColor: "#f8f9fa",
    borderBottom: "2px solid #eee",
  },
  th: {
    padding: "15px",
    color: "#7f8c8d",
    textTransform: "uppercase",
    fontSize: "0.8rem",
    letterSpacing: "1px",
  },
  tr: {
    borderBottom: "1px solid #eee",
    transition: "background-color 0.2s",
  },
  td: {
    padding: "15px",
    color: "#444",
  },
  tdBold: {
    padding: "15px",
    fontWeight: "600",
    color: "#2c3e50",
  },
  actionBtn: {
    padding: "5px 10px",
    border: "1px solid #3498db",
    borderRadius: "4px",
    backgroundColor: "transparent",
    color: "#3498db",
    cursor: "pointer",
    fontSize: "0.8rem",
  },
  loadingContainer: {
    textAlign: "center",
    padding: "40px",
    color: "#7f8c8d",
  },
  spinner: {
    width: "30px",
    height: "30px",
    border: "3px solid #f3f3f3",
    borderTop: "3px solid #3498db",
    borderRadius: "50%",
    margin: "0 auto 10px",
    animation: "spin 1s linear infinite",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px",
    color: "#bdc3c7",
    backgroundColor: "#fafafa",
    borderRadius: "12px",
    border: "2px dashed #eee",
  },
  createBtn: {
  padding: "8px 12px",
  border: "none",
  borderRadius: "5px",
  backgroundColor: "#2ecc71",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
},
};

export default ListBooks;