
import { getAuthHeaders } from "../utils/auth";
import { API_BASES, readApiError } from "../utils/api";

const API = API_BASES.loans;

export const borrowBook = async (data) => {
  const res = await fetch(`${API}/loans/borrow`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(await readApiError(res, "Erreur emprunt"));
  }

  return res.json();
};


// 🔥 version corrigée
export const returnBook = async (loanId, userId) => {
  const res = await fetch(
    `${API}/loans/return?loanId=${loanId}&userId=${userId}`,
    {
      method: "POST",
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    throw new Error(await readApiError(res, "Erreur retour"));
  }

  return res.json();
};


export const getHistory = async (userId) => {
  const res = await fetch(`${API}/loans/history/${userId}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(await readApiError(res, "Erreur récupération historique"));
  }

  return res.json();
};

export const getActiveLoans = async (userId) => {
  const res = await fetch(`${API}/loans/active/${userId}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(await readApiError(res, "Erreur récupération emprunts actifs"));
  }

  return res.json();
};
