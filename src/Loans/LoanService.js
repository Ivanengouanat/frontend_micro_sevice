
const API = process.env.REACT_APP_LOANS_API;

export const borrowBook = async (data) => {
  const res = await fetch(`${API}/loans/borrow`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Erreur emprunt");
  }

  return res.json();
};


// 🔥 version corrigée
export const returnBook = async (loanId, userId) => {
  const res = await fetch(
    `${API}/loans/return?loanId=${loanId}&userId=${userId}`,
    {
      method: "POST",
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Erreur retour");
  }

  return res.json();
};


export const getHistory = async (userId) => {
  const res = await fetch(`${API}/loans/history/${userId}`);

  if (!res.ok) {
    throw new Error("Erreur récupération historique");
  }

  return res.json();
};