import { Route, Routes } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Interventions from "@/pages/Interventions";
import Publications from "@/pages/Publications";
import Actualite from "@/pages/Actualite";
import Galerie from "@/pages/Galerie";
import Documentation from "@/pages/Documentation";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import ProtectedRoute from "@/components/admin/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/nous-connaitre" element={<About />} />
        <Route path="/domaine" element={<Interventions />} />
        <Route path="/publications" element={<Publications />} />
        <Route path="/actualite" element={<Actualite />} />
        <Route path="/galerie" element={<Galerie />} />
        <Route path="/documentation" element={<Documentation />} />
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;

