

const API_BASE_URL = "https://company-management-5yta.onrender.com"

const getNotifications = async () => {
  const res = await fetch(`${API_BASE_URL}api/v1/notifications/notification`, {
    credentials: "include"
  });
  return res.json();
};

const markAsRead = async (id) => {
  await fetch(`${API_BASE_URL}api/v1/notifications/mark-read/${id}`, {
    method: "PATCH",
    credentials: "include"
  });
};

export {
    getNotifications,
    markAsRead
}
