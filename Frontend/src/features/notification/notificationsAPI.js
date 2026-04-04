

const API_BASE_URL = "http://localhost:8000/api/v1/notifications"

const getNotifications = async () => {
  const res = await fetch(`${API_BASE_URL}/notification`, {
    credentials: "include"
  });
  return res.json();
};

const markAsRead = async (id) => {
  await fetch(`${API_BASE_URL}/mark-read/${id}`, {
    method: "PATCH",
    credentials: "include"
  });
};

export {
    getNotifications,
    markAsRead
}