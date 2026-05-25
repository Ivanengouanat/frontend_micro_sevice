import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getActiveLoans } from "../Loans/LoanService";
import { API_BASES, readApiError } from "../utils/api";

function ListBooks() {
  const [books, setBooks] = useState([]);
  const [myLoans, setMyLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BOOKS_API = API_BASES.books;

  const navigate = useNavigate();

  // IMPORTANT : utiliser seulement l'id
  // évite les rerenders infinis
  const userId = JSON.parse(
    localStorage.getItem("user")
  )?.id;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        // récupérer les livres
        const booksRes = await fetch(
          `${BOOKS_API}/books`
        );

        if (!booksRes.ok) {
          throw new Error(
            await readApiError(booksRes, "Erreur récupération livres")
          );
        }

        const booksData =
          await booksRes.json();

        setBooks(
          Array.isArray(booksData)
            ? booksData
            : []
        );

        // récupérer mes emprunts
        if (userId) {
          const loans = await getActiveLoans(userId);
          setMyLoans(Array.isArray(loans) ? loans : []);
        }

      } catch (error) {
        console.error(error);
        setError(error.message || "Impossible de charger la bibliothèque");
        setBooks([]);
        setMyLoans([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();

  }, [BOOKS_API, userId]);

  // vérifier si ce livre est emprunté par moi
  const getMyLoanForBook = (
    bookId
  ) => {
    return myLoans.find(
      (loan) =>
        loan.bookId === bookId
    );
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        Chargement...
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h2 style={styles.title}>
          📚 Bibliothèque
        </h2>

        <span style={styles.counter}>
          {books.length} livres
        </span>
        <button
          style={styles.detailsBtn}
          onClick={() =>
            navigate("/create")
          }
        >
          Ajouter
        </button>
      </div>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {/* EMPTY */}
      {books.length === 0 && (
        <div style={styles.empty}>
          Aucun livre trouvé
        </div>
      )}

      {/* TABLE */}
      {books.length > 0 && (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>
                  ID
                </th>

                <th style={styles.th}>
                  Titre
                </th>

                <th style={styles.th}>
                  Auteur
                </th>

                <th style={styles.th}>
                  Status
                </th>

                <th style={styles.th}>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {books.map(
                (book, index) => {

                  const myLoan =
                    getMyLoanForBook(
                      book.id
                    );

                  return (
                    <tr
                      key={
                        book.id
                      }
                      style={{
                        ...styles.tr,
                        backgroundColor:
                          index %
                            2 ===
                          0
                            ? "#fff"
                            : "#fafafa",
                      }}
                    >
                      <td
                        style={
                          styles.td
                        }
                      >
                        #
                        {
                          book.id
                        }
                      </td>

                      <td
                        style={
                          styles.tdTitle
                        }
                      >
                        {
                          book.title
                        }
                      </td>

                      <td
                        style={
                          styles.td
                        }
                      >
                        {
                          book.author
                        }
                      </td>

                      <td
                        style={
                          styles.td
                        }
                      >
                        <span
                          style={{
                            ...styles.statusBadge,

                            backgroundColor:
                              book.available
                                ? "#2ecc71"
                                : "#e74c3c",
                          }}
                        >
                          {book.available
                            ? "Disponible"
                            : "Emprunté"}
                        </span>
                      </td>

                      <td
                        style={
                          styles.td
                        }
                      >
                        <div
                          style={
                            styles.actions
                          }
                        >
                          {/* détails */}
                          <button
                            style={
                              styles.detailsBtn
                            }
                            onClick={() =>
                              navigate(
                                `/books/${book.id}`
                              )
                            }
                          >
                            Détails
                          </button>

                          {/* emprunter */}
                          {book.available && (
                            <button
                              style={
                                styles.borrowBtn
                              }
                              onClick={() =>
                                navigate(
                                  "/loans/borrow",
                                  {
                                    state:
                                      {
                                        bookId:
                                          book.id,
                                        bookTitle:
                                          book.title,
                                      },
                                  }
                                )
                              }
                            >
                              Emprunter
                            </button>
                          )}

                          {/* retourner seulement si c'est mon emprunt */}
                          {myLoan && (
                            <button
                              style={
                                styles.returnBtn
                              }
                              onClick={() =>
                                navigate(
                                  "/loans/return",
                                  {
                                    state:
                                      {
                                        loanId:
                                          myLoan.id,
                                      },
                                  }
                                )
                              }
                            >
                              Retourner
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ListBooks;

const styles = {
  container: {
    padding: "25px",
    backgroundColor:
      "#f5f7fa",
    minHeight: "100vh",
  },

  header: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  title: {
    margin: 0,
    color: "#2c3e50",
  },

  counter: {
    backgroundColor:
      "#3498db",
    color: "white",
    padding:
      "6px 12px",
    borderRadius:
      "20px",
    fontWeight: "bold",
    fontSize: "14px",
  },

  loading: {
    textAlign: "center",
    marginTop: "50px",
    fontSize: "18px",
  },

  empty: {
    textAlign: "center",
    padding: "40px",
    backgroundColor:
      "white",
    borderRadius: "10px",
  },

  error: {
    padding: "12px",
    marginBottom: "16px",
    borderRadius: "8px",
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },

  tableWrapper: {
    backgroundColor:
      "white",
    borderRadius:
      "12px",
    overflow: "hidden",
    boxShadow:
      "0 4px 12px rgba(0,0,0,0.08)",
  },

  table: {
    width: "100%",
    borderCollapse:
      "collapse",
  },

  th: {
    backgroundColor:
      "#34495e",
    color: "white",
    padding: "15px",
    textAlign: "left",
    fontSize: "14px",
  },

  tr: {
    borderBottom:
      "1px solid #eee",
  },

  td: {
    padding: "15px",
    color: "#2c3e50",
  },

  tdTitle: {
    padding: "15px",
    fontWeight: "600",
    color: "#2c3e50",
  },

  statusBadge: {
    color: "white",
    padding:
      "5px 10px",
    borderRadius:
      "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  actions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },

  detailsBtn: {
    border: "none",
    padding:
      "7px 12px",
    borderRadius:
      "6px",
    backgroundColor:
      "#3498db",
    color: "white",
    cursor: "pointer",
  },

  borrowBtn: {
    border: "none",
    padding:
      "7px 12px",
    borderRadius:
      "6px",
    backgroundColor:
      "#2ecc71",
    color: "white",
    cursor: "pointer",
  },

  returnBtn: {
    border: "none",
    padding:
      "7px 12px",
    borderRadius:
      "6px",
    backgroundColor:
      "#f39c12",
    color: "white",
    cursor: "pointer",
  },
};
