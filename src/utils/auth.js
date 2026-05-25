export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const getCurrentUserId = () => {
  const user = getCurrentUser();
  return user ? user.id : null;
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
