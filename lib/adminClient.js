export const getAdminToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("adminToken");
};

export const setAdminToken = (token) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("adminToken", token);
};

export const adminPostForm = async (path, formData) => {
  const token = getAdminToken();
  if (!token) {
    throw new Error("Missing admin token.");
  }
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "x-admin-token": token,
    },
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result?.error || "Request failed.");
  }
  return result;
};
