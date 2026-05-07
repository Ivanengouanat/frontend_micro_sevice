const API = process.env.REACT_APP_NOTIFICATION_API;

export const getNotifications = async (userId) => {
  const res = await fetch(
    `${API}/notifications/${userId}`
  );

  if (!res.ok) {
    throw new Error(
      "Erreur récupération notifications"
    );
  }

  return res.json();
};