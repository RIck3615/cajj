import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Plus, Trash2, Edit, Image, Video, Newspaper, BookOpen, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { logout } from "@/services/auth";
import {
  getNews,
  createNews,
  updateNews,
  deleteNews,
  toggleNewsVisibility,
} from "@/services/admin";
import {
  getPhotos,
  uploadPhoto,
  updatePhoto,
  deletePhoto,
  togglePhotoVisibility,
} from "@/services/admin";
import {
  getVideos,
  uploadVideo,
  addVideoUrl,
  updateVideo,
  deleteVideo,
  toggleVideoVisibility,
} from "@/services/admin";
import {
  getPublications,
  createPublication,
  updatePublication,
  deletePublication,
  togglePublicationVisibility,
} from "@/services/admin";
import {
  getAbout,
  updateAboutSection,
} from "@/services/admin";

import { API_URL } from "@/services/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("news");
  const [news, setNews] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [publications, setPublications] = useState({ cajj: [], partners: [] });
  const [about, setAbout] = useState({ sections: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === "news") {
        const res = await getNews();
        setNews(res.data);
      } else if (activeTab === "photos") {
        const res = await getPhotos();
        setPhotos(res.data);
      } else if (activeTab === "videos") {
        const res = await getVideos();
        setVideos(res.data);
      } else if (activeTab === "publications") {
        const res = await getPublications();
        setPublications(res.data);
      } else if (activeTab === "about") {
        const res = await getAbout();
        setAbout(res.data);
      }
    } catch (err) {
      console.error("Erreur chargement données:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold text-primary">Administration CAJJ</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </header>

      <div className="container py-8">
        <div className="mb-6 flex gap-2 border-b">
          <Button
            variant={activeTab === "news" ? "default" : "ghost"}
            onClick={() => setActiveTab("news")}
            className="rounded-b-none"
          >
            <Newspaper className="mr-2 h-4 w-4" />
            Actualités
          </Button>
          <Button
            variant={activeTab === "photos" ? "default" : "ghost"}
            onClick={() => setActiveTab("photos")}
            className="rounded-b-none"
          >
            <Image className="mr-2 h-4 w-4" />
            Photos
          </Button>
          <Button
            variant={activeTab === "videos" ? "default" : "ghost"}
            onClick={() => setActiveTab("videos")}
            className="rounded-b-none"
          >
            <Video className="mr-2 h-4 w-4" />
            Vidéos
          </Button>
          <Button
            variant={activeTab === "publications" ? "default" : "ghost"}
            onClick={() => setActiveTab("publications")}
            className="rounded-b-none"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Publications
          </Button>
          <Button
            variant={activeTab === "about" ? "default" : "ghost"}
            onClick={() => setActiveTab("about")}
            className="rounded-b-none"
          >
            <Users className="mr-2 h-4 w-4" />
            Nous connaître
          </Button>
        </div>

        {activeTab === "news" && (
          <NewsManager news={news} onRefresh={loadData} loading={loading} />
        )}
        {activeTab === "photos" && (
          <PhotosManager photos={photos} onRefresh={loadData} loading={loading} />
        )}
        {activeTab === "videos" && (
          <VideosManager videos={videos} onRefresh={loadData} loading={loading} />
        )}
        {activeTab === "publications" && (
          <PublicationsManager publications={publications} onRefresh={loadData} loading={loading} />
        )}
        {activeTab === "about" && (
          <AboutManager about={about} onRefresh={loadData} loading={loading} />
        )}
      </div>
    </div>
  );
};

// Composant gestion actualités
const NewsManager = ({ news, onRefresh, loading }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: "", content: "", author: "CAJJ" });
  const [submitting, setSubmitting] = useState(false);

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({ title: item.title, content: item.content, author: item.author || "CAJJ" });
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ title: "", content: "", author: "CAJJ" });
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await updateNews(editingId, formData);
      } else {
        await createNews(formData);
      }
      handleCancel();
      onRefresh();
    } catch (err) {
      alert("Erreur: " + (err.response?.data?.error || "Erreur inconnue"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette actualité ?")) return;
    try {
      await deleteNews(id);
      onRefresh();
    } catch (err) {
      alert("Erreur: " + (err.response?.data?.error || "Erreur inconnue"));
    }
  };

  const handleToggleVisibility = async (id, currentVisible) => {
    try {
      await toggleNewsVisibility(id, !currentVisible);
      onRefresh();
    } catch (err) {
      alert("Erreur: " + (err.response?.data?.error || "Erreur inconnue"));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Gestion des actualités</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Modifier l'actualité" : "Nouvelle actualité"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Titre</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Contenu</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                  rows={5}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Auteur</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Enregistrement..." : "Enregistrer"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <p className="text-center text-muted-foreground">Chargement...</p>
      ) : news.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Aucune actualité pour le moment
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {news.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <Badge variant={item.visible ? "default" : "secondary"}>
                        {item.visible ? "Publié" : "Masqué"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(item)}
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleVisibility(item.id, item.visible)}
                      className={item.visible ? "text-green-600" : "text-muted-foreground"}
                      title={item.visible ? "Masquer" : "Publier"}
                    >
                      {item.visible ? "👁️" : "👁️‍🗨️"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(item.date).toLocaleDateString("fr-FR")} • {item.author}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{item.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Composant gestion photos
const PhotosManager = ({ photos, onRefresh, loading }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "", file: null });
  const [submitting, setSubmitting] = useState(false);

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({ title: item.title, description: item.description || "", file: null });
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", file: null });
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      // Mode édition : mettre à jour sans fichier
      setSubmitting(true);
      try {
        await updatePhoto(editingId, { title: formData.title, description: formData.description });
        handleCancel();
        onRefresh();
      } catch (err) {
        alert("Erreur: " + (err.response?.data?.error || "Erreur inconnue"));
      } finally {
        setSubmitting(false);
      }
    } else {
      // Mode création : uploader un nouveau fichier
      if (!formData.file) {
        alert("Veuillez sélectionner un fichier");
        return;
      }
      setSubmitting(true);
      try {
        const data = new FormData();
        data.append("file", formData.file);
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("type", "photos");
        await uploadPhoto(data);
        handleCancel();
        onRefresh();
      } catch (err) {
        alert("Erreur: " + (err.response?.data?.error || "Erreur inconnue"));
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette photo ?")) return;
    try {
      await deletePhoto(id);
      onRefresh();
    } catch (err) {
      alert("Erreur: " + (err.response?.data?.error || "Erreur inconnue"));
    }
  };

  const handleToggleVisibility = async (id, currentVisible) => {
    try {
      await togglePhotoVisibility(id, !currentVisible);
      onRefresh();
    } catch (err) {
      alert("Erreur: " + (err.response?.data?.error || "Erreur inconnue"));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Gestion des photos</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Modifier la photo" : "Nouvelle photo"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Titre</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                  rows={3}
                />
              </div>
              {!editingId && (
                <div>
                  <label className="text-sm font-medium">Fichier image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                  />
                </div>
              )}
              <div className="flex gap-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Enregistrement..." : editingId ? "Modifier" : "Enregistrer"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <p className="text-center text-muted-foreground">Chargement...</p>
      ) : photos.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Aucune photo pour le moment
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {photos.map((photo) => {
            const imageUrl = photo.url.startsWith("http") 
              ? photo.url 
              : `${API_URL}${photo.url}`;
            
            return (
              <Card key={photo.id} className="overflow-hidden">
                <div className="relative h-48 w-full bg-muted">
                  <img
                    src={imageUrl}
                    alt={photo.title}
                    className="h-full w-full object-cover"
                    onLoad={() => {
                      console.log("✅ Image chargée:", imageUrl);
                    }}
                    onError={(e) => {
                      console.error("❌ Erreur chargement image:", {
                        url: imageUrl,
                        photoUrl: photo.url,
                        apiUrl: API_URL,
                        fullUrl: imageUrl
                      });
                      // Afficher un message d'erreur plus détaillé
                      const errorDiv = e.target.nextElementSibling;
                      if (errorDiv) {
                        errorDiv.innerHTML = `
                          <div class="p-4 text-center">
                            <p class="text-sm font-medium text-destructive mb-1">Image non disponible</p>
                            <p class="text-xs text-muted-foreground break-all">${imageUrl}</p>
                          </div>
                        `;
                        errorDiv.style.display = "flex";
                      }
                      e.target.style.display = "none";
                    }}
                  />
                  <div 
                    className="hidden h-full w-full items-center justify-center bg-muted text-muted-foreground"
                    style={{ display: "none" }}
                  >
                    <p className="text-sm">Image non disponible</p>
                  </div>
                </div>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-sm">{photo.title}</CardTitle>
                      <Badge variant={photo.visible ? "default" : "secondary"} className="text-xs">
                        {photo.visible ? "Publié" : "Masqué"}
                      </Badge>
                    </div>
                    {photo.description && (
                      <p className="text-xs text-muted-foreground">{photo.description}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(photo)}
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleVisibility(photo.id, photo.visible)}
                      className={photo.visible ? "text-green-600" : "text-muted-foreground"}
                      title={photo.visible ? "Masquer" : "Publier"}
                    >
                      {photo.visible ? "👁️" : "👁️‍🗨️"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(photo.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Composant gestion vidéos
const VideosManager = ({ videos, onRefresh, loading }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formType, setFormType] = useState("url"); // "url" ou "file"
  const [formData, setFormData] = useState({ title: "", description: "", url: "", file: null });
  const [submitting, setSubmitting] = useState(false);

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({ 
      title: item.title, 
      description: item.description || "", 
      url: item.url.startsWith("http") ? item.url : "", 
      file: null 
    });
    setFormType(item.url.startsWith("http") ? "url" : "file");
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", url: "", file: null });
    setFormType("url");
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      // Mode édition : mettre à jour sans fichier
      setSubmitting(true);
      try {
        await updateVideo(editingId, { 
          title: formData.title, 
          description: formData.description,
          ...(formData.url && { url: formData.url })
        });
        handleCancel();
        onRefresh();
      } catch (err) {
        alert("Erreur: " + (err.response?.data?.error || "Erreur inconnue"));
      } finally {
        setSubmitting(false);
      }
    } else {
      // Mode création
      setSubmitting(true);
      try {
        if (formType === "url") {
          if (!formData.url) {
            alert("Veuillez entrer une URL");
            return;
          }
          await addVideoUrl({ title: formData.title, description: formData.description, url: formData.url });
        } else {
          if (!formData.file) {
            alert("Veuillez sélectionner un fichier");
            return;
          }
          const data = new FormData();
          data.append("file", formData.file);
          data.append("title", formData.title);
          data.append("description", formData.description);
          data.append("type", "videos");
          await uploadVideo(data);
        }
        handleCancel();
        onRefresh();
      } catch (err) {
        alert("Erreur: " + (err.response?.data?.error || "Erreur inconnue"));
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette vidéo ?")) return;
    try {
      await deleteVideo(id);
      onRefresh();
    } catch (err) {
      alert("Erreur: " + (err.response?.data?.error || "Erreur inconnue"));
    }
  };

  const handleToggleVisibility = async (id, currentVisible) => {
    try {
      await toggleVideoVisibility(id, !currentVisible);
      onRefresh();
    } catch (err) {
      alert("Erreur: " + (err.response?.data?.error || "Erreur inconnue"));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Gestion des vidéos</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Modifier la vidéo" : "Nouvelle vidéo"}</CardTitle>
          </CardHeader>
          <CardContent>
            {!editingId && (
              <div className="mb-4 flex gap-2">
                <Button
                  type="button"
                  variant={formType === "url" ? "default" : "outline"}
                  onClick={() => setFormType("url")}
                  size="sm"
                >
                  URL (YouTube, Vimeo, etc.)
                </Button>
                <Button
                  type="button"
                  variant={formType === "file" ? "default" : "outline"}
                  onClick={() => setFormType("file")}
                  size="sm"
                >
                  Fichier vidéo
                </Button>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Titre</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                  rows={3}
                />
              </div>
              {editingId ? (
                <div>
                  <label className="text-sm font-medium">URL de la vidéo (optionnel pour modifier)</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              ) : formType === "url" ? (
                <div>
                  <label className="text-sm font-medium">URL de la vidéo</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                    placeholder="https://youtube.com/watch?v=..."
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="text-sm font-medium">Fichier vidéo</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                  />
                </div>
              )}
              <div className="flex gap-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Enregistrement..." : editingId ? "Modifier" : "Enregistrer"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <p className="text-center text-muted-foreground">Chargement...</p>
      ) : videos.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Aucune vidéo pour le moment
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {videos.map((video) => (
            <Card key={video.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{video.title}</CardTitle>
                      <Badge variant={video.visible ? "default" : "secondary"}>
                        {video.visible ? "Publié" : "Masqué"}
                      </Badge>
                    </div>
                    {video.description && (
                      <p className="text-sm text-muted-foreground">{video.description}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(video)}
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleVisibility(video.id, video.visible)}
                      className={video.visible ? "text-green-600" : "text-muted-foreground"}
                      title={video.visible ? "Masquer" : "Publier"}
                    >
                      {video.visible ? "👁️" : "👁️‍🗨️"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(video.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {video.url.startsWith("http") ? (
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {video.url}
                  </a>
                ) : (
                  <video
                    src={`${API_URL}${video.url}`}
                    controls
                    className="w-full rounded-md"
                    style={{ maxHeight: "300px" }}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Composant gestion publications
const PublicationsManager = ({ publications, onRefresh, loading }) => {
  const [activeType, setActiveType] = useState("cajj"); // "cajj" ou "partners"
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: "", name: "", description: "", url: "" });
  const [submitting, setSubmitting] = useState(false);

  const currentPublications = publications[activeType] || [];

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || "",
      name: item.name || "",
      description: item.description || "",
      url: item.url || "",
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ title: "", name: "", description: "", url: "" });
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = activeType === "cajj"
        ? { title: formData.title, description: formData.description, url: formData.url }
        : { name: formData.name, description: formData.description, url: formData.url };

      if (editingId) {
        await updatePublication(activeType, editingId, data);
      } else {
        await createPublication(activeType, data);
      }
      handleCancel();
      onRefresh();
    } catch (err) {
      alert("Erreur: " + (err.response?.data?.error || "Erreur inconnue"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette publication ?")) return;
    try {
      await deletePublication(activeType, id);
      onRefresh();
    } catch (err) {
      alert("Erreur: " + (err.response?.data?.error || "Erreur inconnue"));
    }
  };

  const handleToggleVisibility = async (id, currentVisible) => {
    try {
      await togglePublicationVisibility(activeType, id, !currentVisible);
      onRefresh();
    } catch (err) {
      alert("Erreur: " + (err.response?.data?.error || "Erreur inconnue"));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Gestion des publications</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter
        </Button>
      </div>

      <div className="flex gap-2 border-b">
        <Button
          variant={activeType === "cajj" ? "default" : "ghost"}
          onClick={() => {
            setActiveType("cajj");
            handleCancel();
          }}
          className="rounded-b-none"
        >
          Publications CAJJ
        </Button>
        <Button
          variant={activeType === "partners" ? "default" : "ghost"}
          onClick={() => {
            setActiveType("partners");
            handleCancel();
          }}
          className="rounded-b-none"
        >
          Partenaires
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId
                ? `Modifier la publication ${activeType === "cajj" ? "CAJJ" : "partenaire"}`
                : `Nouvelle publication ${activeType === "cajj" ? "CAJJ" : "partenaire"}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeType === "cajj" ? (
                <div>
                  <label className="text-sm font-medium">Titre</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="text-sm font-medium">Nom du partenaire</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                  />
                </div>
              )}
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">URL</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="https://..."
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Enregistrement..." : editingId ? "Modifier" : "Enregistrer"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <p className="text-center text-muted-foreground">Chargement...</p>
      ) : currentPublications.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Aucune publication pour le moment
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {currentPublications.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{item.title || item.name}</CardTitle>
                      <Badge variant={item.visible ? "default" : "secondary"}>
                        {item.visible ? "Publié" : "Masqué"}
                      </Badge>
                    </div>
                    {item.description && (
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    )}
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline mt-1 block"
                      >
                        {item.url}
                      </a>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(item)}
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleVisibility(item.id, item.visible)}
                      className={item.visible ? "text-green-600" : "text-muted-foreground"}
                      title={item.visible ? "Masquer" : "Publier"}
                    >
                      {item.visible ? "👁️" : "👁️‍🗨️"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Composant gestion "Nous connaître"
const AboutManager = ({ about, onRefresh, loading }) => {
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [submitting, setSubmitting] = useState(false);

  const sections = about.sections || [];

  const handleEdit = (section) => {
    setEditingId(section.id);
    setFormData({ title: section.title, content: section.content });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ title: "", content: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingId) return;

    setSubmitting(true);
    try {
      await updateAboutSection(editingId, formData);
      handleCancel();
      onRefresh();
    } catch (err) {
      alert("Erreur: " + (err.response?.data?.error || "Erreur inconnue"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Gestion de la section "Nous connaître"</h2>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground">Chargement...</p>
      ) : (
        <div className="space-y-6">
          {sections.map((section) => (
            <Card key={section.id} className="border-border/60">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{section.title}</CardTitle>
                    {editingId !== section.id ? (
                      <CardDescription className="text-sm whitespace-pre-line">
                        {section.content}
                      </CardDescription>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div>
                          <label className="text-sm font-medium">Titre</label>
                          <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Contenu</label>
                          <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                            rows={6}
                            required
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit" disabled={submitting}>
                            {submitting ? "Enregistrement..." : "Enregistrer"}
                          </Button>
                          <Button type="button" variant="outline" onClick={handleCancel}>
                            Annuler
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                  {editingId !== section.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(section)}
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

