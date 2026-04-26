import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
   const USERS_API = process.env.REACT_APP_USERS_API;

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${USERS_API}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de l'inscription");
      }

    //   const data = await res.json();

      alert("Compte créé avec succès ✅");

      // redirection vers login
      navigate("/login");

      

    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Inscription</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={form.username}
          required
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          style={styles.input}
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={form.password}
          required
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Inscription..." : "S'inscrire"}
        </button>
      </form>

      {/* 🔥 Lien vers Login */}
      <p style={styles.linkText}>
        Déjà un compte ?{" "}
        <Link to="/login" style={styles.link}>
          Se connecter
        </Link>
      </p>
    </div>
  );
}

// Styles (même design que Login pour cohérence)
const styles = {
  container: {
    maxWidth: "400px",
    margin: "100px auto",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
    backgroundColor: "#fff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#2ecc71",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
  linkText: {
    marginTop: "15px",
  },
  link: {
    color: "#3498db",
    textDecoration: "none",
    fontWeight: "bold",
  },
};