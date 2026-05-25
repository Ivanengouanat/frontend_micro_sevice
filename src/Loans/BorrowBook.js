import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { borrowBook } from "./LoanService";

function BorrowBook() {
  const location = useLocation();
  const navigate = useNavigate();

  const [bookId, setBookId] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  
  useEffect(() => {
    if (location.state?.bookId) {
      setBookId(location.state.bookId);
    }
    if (location.state?.bookTitle) {
      setBookTitle(location.state.bookTitle);
    }
  }, [location.state]);

  const handleBorrow = async () => {
    setMessage("");

    if (!user) {
      setMessage("❌ Utilisateur non connecté");
      return;
    }

    const numericBookId = Number(bookId);
    if (!numericBookId || numericBookId < 1) {
      setMessage("⚠️ ID du livre invalide");
      return;
    }

    setLoading(true);

    try {
      await borrowBook({
        userId: user.id,
        bookId: numericBookId,
      });

      setMessage("✅ Livre emprunté !");
      
      
      setTimeout(() => {
        navigate("/loans");
      }, 1000);

    } catch (err) {
      setMessage("❌ " + err.message); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>📖 Emprunter un livre</h2>
        {bookTitle && <p style={styles.subtitle}>{bookTitle}</p>}

        <input
          style={styles.input}
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          placeholder="ID du livre"
          type="number"
          min="1"
        />

        <button onClick={handleBorrow} disabled={loading} style={styles.button}>
          {loading ? "..." : "Emprunter"}
        </button>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default BorrowBook;



const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    marginTop: "40px",
  },

  card: {
    width: "350px",
    padding: "20px",
    borderRadius: "12px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    textAlign: "center",
  },

  title: {
    marginBottom: "20px",
    color: "#2c3e50",
  },

  subtitle: {
    color: "#64748b",
    marginTop: "-8px",
    marginBottom: "18px",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
  },

  message: {
    marginTop: "10px",
    fontSize: "0.9rem",
    color: "#2c3e50",
  },
};
