import React, { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) return <p>Aucun utilisateur connecté</p>;

  return (
    <div style={styles.container}>
      <h2>👤 Mon Profil</h2>

      <div style={styles.card}>
        <p><strong>ID :</strong> {user.id}</p>
        <p><strong>Username :</strong> {user.username}</p>
        <p><strong>Email :</strong> {user.email}</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "500px",
    margin: "2rem auto",
    textAlign: "center",
  },
  card: {
    padding: "1.5rem",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "left",
  },
};