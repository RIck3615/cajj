import api from "./api";

// Actualités
export const getNews = () => api.get("/admin/news");
export const createNews = (data) => {
  if (data instanceof FormData) {
    return api.post("/admin/news", data, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 300000, // 5 minutes pour les uploads de fichiers
    });
  }
  return api.post("/admin/news", data);
};
export const updateNews = (id, data) => {
  if (data instanceof FormData) {
    // Pour FormData avec PUT, utiliser POST avec _method=PUT
    data.append('_method', 'PUT');
    return api.post(`/admin/news/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 300000, // 5 minutes pour les uploads de fichiers
    });
  }
  return api.put(`/admin/news/${id}`, data);
};
export const deleteNews = (id) => api.delete(`/admin/news/${id}`);
export const toggleNewsVisibility = (id, visible) =>
  api.patch(`/admin/news/${id}/visibility`, { visible });

// Photos
export const getPhotos = () => api.get("/admin/gallery/photos");
export const uploadPhoto = (formData) =>
  api.post("/admin/gallery/photos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 300000, // 5 minutes pour les uploads de fichiers
  });
export const updatePhoto = (id, data) => api.put(`/admin/gallery/photos/${id}`, data);
export const deletePhoto = (id) => api.delete(`/admin/gallery/photos/${id}`);
export const togglePhotoVisibility = (id, visible) =>
  api.patch(`/admin/gallery/photos/${id}/visibility`, { visible });

// Vidéos
export const getVideos = () => api.get("/admin/gallery/videos");
export const uploadVideo = (formData) =>
  api.post("/admin/gallery/videos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 300000, // 5 minutes pour les uploads de fichiers vidéo
  });
export const addVideoUrl = (data) => api.post("/admin/gallery/videos", data);
export const updateVideo = (id, data) => api.put(`/admin/gallery/videos/${id}`, data);
export const deleteVideo = (id) => api.delete(`/admin/gallery/videos/${id}`);
export const toggleVideoVisibility = (id, visible) =>
  api.patch(`/admin/gallery/videos/${id}/visibility`, { visible });

// Publications
export const getPublications = () => api.get("/admin/publications");
export const createPublication = (type, data) => {
  if (data instanceof FormData) {
    return api.post(`/admin/publications/${type}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 300000, // 5 minutes pour les uploads de fichiers
    });
  }
  return api.post(`/admin/publications/${type}`, data);
};
export const updatePublication = (type, id, data) => {
  if (data instanceof FormData) {
    // Pour FormData avec PUT, utiliser POST avec _method=PUT
    data.append('_method', 'PUT');
    return api.post(`/admin/publications/${type}/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 300000, // 5 minutes pour les uploads de fichiers
    });
  }
  return api.put(`/admin/publications/${type}/${id}`, data);
};
export const deletePublication = (type, id) => api.delete(`/admin/publications/${type}/${id}`);
export const togglePublicationVisibility = (type, id, visible) =>
  api.patch(`/admin/publications/${type}/${id}/visibility`, { visible });

// Section "Nous connaître"
export const getAbout = () => api.get("/admin/about");
export const updateAboutSection = (id, data) => api.put(`/admin/about/sections/${id}`, data);

// Actions
export const getActions = () => api.get("/admin/actions");
export const updateAction = (id, data) => api.put(`/admin/actions/${id}`, data);

