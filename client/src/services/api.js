import axios from "axios";
import { getToken, clearToken } from "./auth";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL,
});

// Attach JWT automatically
api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle expired/invalid JWT
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();

      if (!window.location.pathname.startsWith("/admin/login")) {
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  },
);

// --------------------
// AUTH
// --------------------

export const AuthAPI = {
  login: (username, password) =>
    api.post("/auth/login", { username, password }).then((res) => res.data),
};

// --------------------
// SUBJECTS
// --------------------

export const SubjectsAPI = {
  list: () => api.get("/subjects").then((res) => res.data),

  create: (payload) => api.post("/subjects", payload).then((res) => res.data),

  update: (id, payload) =>
    api.put(`/subjects/${id}`, payload).then((res) => res.data),

  remove: (id) => api.delete(`/subjects/${id}`).then((res) => res.data),
};

// --------------------
// PDFS
// --------------------

export const PdfsAPI = {
  list: () => api.get("/pdfs").then((res) => res.data),

  bySubject: (id) => api.get(`/pdfs/subject/${id}`).then((res) => res.data),

  upload: (formData, onProgress) =>
    api
      .post("/pdfs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (event) => {
          if (onProgress && event.total) {
            onProgress(Math.round((event.loaded / event.total) * 100));
          }
        },
      })
      .then((res) => res.data),

  update: (id, formData) =>
    api
      .put(`/pdfs/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data),

  remove: (id) => api.delete(`/pdfs/${id}`).then((res) => res.data),
};

// Helper for preview/download
export function pdfFileUrl(pdf) {
  return (
    pdf?.file_url ||
    pdf?.url ||
    pdf?.fileUrl ||
    `${baseURL}/pdfs/${pdf?.id}/file`
  );
}

export default api;
