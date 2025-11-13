import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Plus, Trash2, Edit, Image, Video, Newspaper } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { logout } from "@/services/auth";
import { getNews, createNews, deleteNews } from "@/services/admin";
import { getPhotos, uploadPhoto, deletePhoto } from "@/services/admin";
import { getVideos, uploadVideo, addVideoUrl, deleteVideo } from "@/services/admin";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("news");
  const [news, setNews] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
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
      </div>
    </div>
  );
};

// Composant gestion actualités
const NewsManager = ({ news, onRefresh, loading }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "", author: "CAJJ" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createNews(formData);
      setFormData({ title: "", content: "", author: "CAJJ" });
      setShowForm(false);
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
            <CardTitle>Nouvelle actualité</CardTitle>
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
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
  const [formData, setFormData] = useState({ title: "", description: "", file: null });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      setFormData({ title: "", description: "", file: null });
      setShowForm(false);
      onRefresh();
    } catch (err) {
      alert("Erreur: " + (err.response?.data?.error || "Erreur inconnue"));
    } finally {
      setSubmitting(false);
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
            <CardTitle>Nouvelle photo</CardTitle>
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
              <div className="flex gap-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Upload..." : "Enregistrer"}
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
      ) : photos.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Aucune photo pour le moment
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {photos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden">
              <img
                src={`${API_URL}${photo.url}`}
                alt={photo.title}
                className="h-48 w-full object-cover"
              />
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm">{photo.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(photo.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {photo.description && (
                  <p className="text-xs text-muted-foreground">{photo.description}</p>
                )}
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Composant gestion vidéos
const VideosManager = ({ videos, onRefresh, loading }) => {
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState("url"); // "url" ou "file"
  const [formData, setFormData] = useState({ title: "", description: "", url: "", file: null });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      setFormData({ title: "", description: "", url: "", file: null });
      setShowForm(false);
      onRefresh();
    } catch (err) {
      alert("Erreur: " + (err.response?.data?.error || "Erreur inconnue"));
    } finally {
      setSubmitting(false);
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
            <CardTitle>Nouvelle vidéo</CardTitle>
          </CardHeader>
          <CardContent>
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
              {formType === "url" ? (
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
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{video.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(video.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {video.description && (
                  <p className="text-sm text-muted-foreground">{video.description}</p>
                )}
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

export default AdminDashboard;

