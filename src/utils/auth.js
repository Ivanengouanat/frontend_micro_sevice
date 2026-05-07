export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const getCurrentUserId = () => {
  const user = getCurrentUser();
  return user ? user.id : null;
};