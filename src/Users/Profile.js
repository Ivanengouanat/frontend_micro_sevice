import React, { useEffect, useState } from "react";
import { getAuthHeaders } from "../utils/auth";
import { API_BASES } from "../utils/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const USERS_API = API_BASES.users;

  useEffect(() => {
    const loadProfile = async () => {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      try {
        const res = await fetch(`${USERS_API}/users/profile`, {
          headers: getAuthHeaders(),
        });

        if (res.ok) {
          const freshUser = await res.json();
          setUser(freshUser);
          localStorage.setItem("user", JSON.stringify(freshUser));
        }
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
      }
    };

    loadProfile();
  }, [USERS_API]);

  if (!user) return <p>Aucun utilisateur connecté</p>;

  return (
    <div style={styles.container}>
      <h2>👤 Mon Profil</h2>

      <div style={styles.card}>
        <p><strong>ID :</strong> {user.id}</p>
        <p><strong>Username :</strong> {user.username}</p>
        <p><strong>Email :</strong> {user.email}</p>
        <p><strong>Rôle :</strong> {user.role || "MEMBER"}</p>
        <p><strong>Statut :</strong> {user.active === false ? "Désactivé" : "Actif"}</p>
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
