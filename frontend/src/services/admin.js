import api from "./api";

// Actualités
export const getNews = () => api.get("/api/admin/news");
export const createNews = (data) => api.post("/api/admin/news", data);
export const updateNews = (id, data) => api.put(`/api/admin/news/${id}`, data);
export const deleteNews = (id) => api.delete(`/api/admin/news/${id}`);

// Photos
export const getPhotos = () => api.get("/api/admin/gallery/photos");
export const uploadPhoto = (formData) =>
  api.post("/api/admin/gallery/photos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deletePhoto = (id) => api.delete(`/api/admin/gallery/photos/${id}`);

// Vidéos
export const getVideos = () => api.get("/api/admin/gallery/videos");
export const uploadVideo = (formData) =>
  api.post("/api/admin/gallery/videos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const addVideoUrl = (data) => api.post("/api/admin/gallery/videos", data);
export const deleteVideo = (id) => api.delete(`/api/admin/gallery/videos/${id}`);

