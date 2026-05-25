import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASES, readApiError } from "../utils/api";

function CreateBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const createBook = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    
    // Validation simple
    if (!title.trim() || !author.trim()) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setIsSubmitting(true);
    setError("");
   const BOOKS_API = API_BASES.books;

    try {
      const response = await fetch(`${BOOKS_API}/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author }),
      });

      if (!response.ok) throw new Error(await readApiError(response, "Erreur lors de la création"));

      // const data = await response.json();
      
      // Succès
      setShowSuccess(true);
      setTitle("");
      setAuthor("");
      
      // Masquer le message de succès après 3 secondes
      setTimeout(() => setShowSuccess(false), 3000);
      navigate("/books");

    } catch (err) {
      setError(err.message || "Impossible de créer le livre. Vérifiez votre connexion.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>➕ Ajouter un nouvel ouvrage</h2>
      <p style={styles.subtitle}>Remplissez les informations pour enrichir la collection.</p>

      {showSuccess && (
        <div style={styles.successAlert}>
          ✅ Livre ajouté avec succès !
        </div>
      )}

      {error && (
        <div style={styles.errorAlert}>
          ❌ {error}
        </div>
      )}

      <form onSubmit={createBook} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Titre de l'œuvre</label>
          <input
            type="text"
            placeholder="Ex: Le Petit Prince"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Nom de l'auteur</label>
          <input
            type="text"
            placeholder="Ex: Antoine de Saint-Exupéry"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            style={styles.input}
          />
        </div>

        <button 
          type="submit" 
          style={{
            ...styles.button, 
            backgroundColor: isSubmitting ? "#bdc3c7" : "#2ecc71"
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enregistrement..." : "Enregistrer le livre"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    padding: "10px",
  },
  title: {
    color: "#2c3e50",
    marginBottom: "5px",
  },
  subtitle: {
    color: "#7f8c8d",
    marginBottom: "25px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontWeight: "600",
    color: "#34495e",
    fontSize: "0.9rem",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.3s",
  },
  button: {
    marginTop: "10px",
    padding: "14px",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
    transition: "all 0.3s",
  },
  successAlert: {
    padding: "15px",
    backgroundColor: "#d4edda",
    color: "#155724",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #c3e6cb",
    animation: "fadeIn 0.5s",
  },
  errorAlert: {
    padding: "15px",
    backgroundColor: "#f8d7da",
    color: "#721c24",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #f5c6cb",
  }
};

export default CreateBook;
