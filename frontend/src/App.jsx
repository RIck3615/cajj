import { Route, Routes } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Interventions from "@/pages/Interventions";
import Publications from "@/pages/Publications";
import Actualite from "@/pages/Actualite";
import Galerie from "@/pages/Galerie";

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
      </Route>
    </Routes>
  );
}

export default App;

