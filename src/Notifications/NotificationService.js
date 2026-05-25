import { API_BASES, readApiError } from "../utils/api";

const API = API_BASES.notifications;

export const getNotifications = async (userId) => {
  const res = await fetch(
    `${API}/notifications/${userId}`
  );

  if (!res.ok) {
    throw new Error(await readApiError(res, "Erreur récupération notifications"));
  }

  return res.json();
};

export const getUnreadCount = async (userId) => {
  const res = await fetch(`${API}/notifications/${userId}/unread-count`);

  if (!res.ok) {
    throw new Error(await readApiError(res, "Erreur compteur notifications"));
  }

  return res.json();
};

export const markNotificationsAsRead = async (userId) => {
  const res = await fetch(`${API}/notifications/${userId}/read`, {
    method: "PUT",
  });

  if (!res.ok) {
    throw new Error(await readApiError(res, "Erreur lecture notifications"));
  }
};
