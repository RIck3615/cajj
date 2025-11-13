import api from "./api";

// Actualités
export const getNews = () => api.get("/api/admin/news");
export const createNews = (data) => api.post("/api/admin/news", data);
export const updateNews = (id, data) => api.put(`/api/admin/news/${id}`, data);
export const deleteNews = (id) => api.delete(`/api/admin/news/${id}`);
export const toggleNewsVisibility = (id, visible) =>
  api.patch(`/api/admin/news/${id}/visibility`, { visible });

// Photos
export const getPhotos = () => api.get("/api/admin/gallery/photos");
export const uploadPhoto = (formData) =>
  api.post("/api/admin/gallery/photos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updatePhoto = (id, data) => api.put(`/api/admin/gallery/photos/${id}`, data);
export const deletePhoto = (id) => api.delete(`/api/admin/gallery/photos/${id}`);
export const togglePhotoVisibility = (id, visible) =>
  api.patch(`/api/admin/gallery/photos/${id}/visibility`, { visible });

// Vidéos
export const getVideos = () => api.get("/api/admin/gallery/videos");
export const uploadVideo = (formData) =>
  api.post("/api/admin/gallery/videos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const addVideoUrl = (data) => api.post("/api/admin/gallery/videos", data);
export const updateVideo = (id, data) => api.put(`/api/admin/gallery/videos/${id}`, data);
export const deleteVideo = (id) => api.delete(`/api/admin/gallery/videos/${id}`);
export const toggleVideoVisibility = (id, visible) =>
  api.patch(`/api/admin/gallery/videos/${id}/visibility`, { visible });

// Publications
export const getPublications = () => api.get("/api/admin/publications");
export const createPublication = (type, data) => api.post(`/api/admin/publications/${type}`, data);
export const updatePublication = (type, id, data) => api.put(`/api/admin/publications/${type}/${id}`, data);
export const deletePublication = (type, id) => api.delete(`/api/admin/publications/${type}/${id}`);
export const togglePublicationVisibility = (type, id, visible) =>
  api.patch(`/api/admin/publications/${type}/${id}/visibility`, { visible });

// Section "Nous connaître"
export const getAbout = () => api.get("/api/admin/about");
export const updateAboutSection = (id, data) => api.put(`/api/admin/about/sections/${id}`, data);

