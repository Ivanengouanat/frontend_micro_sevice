import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const USERS_API = process.env.REACT_APP_USERS_API;

  

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    

    try {
      const res = await fetch(`${USERS_API}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Email ou mot de passe incorrect");
      }

     const data = await res.json();

localStorage.setItem("user", JSON.stringify(data));
localStorage.setItem("token", "logged"); // juste pour ton PrivateRoute

      alert("Connexion réussie");

      //  REDIRECTION
      navigate("/books");

    } catch (error) {
      console.error("Erreur lors du login:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Connexion</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
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
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      {/* 🔥 Lien vers Register */}
      <p style={styles.linkText}>
        Pas encore de compte ?{" "}
        <Link to="/register" style={styles.link}>
          S'inscrire
        </Link>
      </p>
    </div>
  );
}

// Styles simples
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
    backgroundColor: "#3498db",
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