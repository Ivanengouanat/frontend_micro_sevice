export const API_BASES = {
  books: process.env.REACT_APP_BOOKS_API || "http://localhost:8081",
  users: process.env.REACT_APP_USERS_API || "http://localhost:8082",
  loans: process.env.REACT_APP_LOANS_API || "http://localhost:8083",
  notifications: process.env.REACT_APP_NOTIFICATION_API || "http://localhost:8084",
};

export const readApiError = async (response, fallback) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const body = await response.json();
    if (body.fields) {
      return Object.values(body.fields).join(" ");
    }
    return body.message || fallback;
  }

  const text = await response.text();
  return text || fallback;
};
