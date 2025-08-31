import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Homepage from "./pages/homepage/Homepage.jsx";
import LoginPage from "./pages/login/LoginPage.jsx";
import MovieDetails from "./pages/detailedView/MovieDetails.jsx"; // You need to create this
import TempLogin from "./pages/login/TempLogin.jsx"; // Temporary login page
import Watchlist from "./pages/watchlist/Watchlist.jsx";
import AiRec from "./pages/aiRec/aiRec.jsx";
import ScrollToTop from "./ScrollToTop.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/:mediaType/:id" element={<MovieDetails />} />
        <Route path="/" element={<TempLogin />} />
        <Route path="/watchlist" element={<Watchlist />}/>
        <Route path="/airecommendation" element={<AiRec />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
